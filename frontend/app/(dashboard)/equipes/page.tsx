'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  UsersRound,
  Plus,
  Search,
  Pencil,
  Trash2,
  Crown,
  UserMinus,
  UserPlus,
} from 'lucide-react';
import {
  Button,
  Input,
  Select,
  Modal,
  Badge,
  Table,
  Pagination,
} from '@/components/ui';
import { PageHeader } from '@/components/layout';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { Team, User, PaginatedResponse } from '@/types';

const teamSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  liderId: z.string().optional().or(z.literal('')),
  membrosIds: z.array(z.string()).optional(),
  ativo: z.boolean().optional(),
});

type TeamFormData = z.infer<typeof teamSchema>;

export default function EquipesPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string | number> = { page, limit: 10 };
      if (debouncedSearch) params.search = debouncedSearch;
      const { data } = await api.get<PaginatedResponse<Team>>('/teams', { params });
      setTeams(data.data);
      setTotalPages(data.meta.totalPages);
      setTotal(data.meta.total);
    } catch (error) {
      console.error('Erro ao buscar equipes:', error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await api.get<PaginatedResponse<User>>('/users', { params: { limit: 100 } });
      setUsers(data.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openCreateModal = () => {
    setSelectedTeam(null);
    setSelectedMembers([]);
    reset({ nome: '', descricao: '', liderId: '', ativo: true });
    setIsModalOpen(true);
  };

  const openEditModal = (team: Team) => {
    setSelectedTeam(team);
    const memberIds = team.membros?.map((m) => m.id) || [];
    setSelectedMembers(memberIds);
    reset({
      nome: team.nome,
      descricao: team.descricao || '',
      liderId: team.liderId || '',
      ativo: team.ativo,
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (team: Team) => {
    setSelectedTeam(team);
    setIsDeleteModalOpen(true);
  };

  const openDetailModal = (team: Team) => {
    setSelectedTeam(team);
    setIsDetailModalOpen(true);
  };

  const toggleMember = (userId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const onSubmit = async (formData: TeamFormData) => {
    try {
      setSaving(true);
      const payload = {
        ...formData,
        liderId: formData.liderId || undefined,
        membrosIds: selectedMembers,
      };
      if (selectedTeam) {
        await api.patch(`/teams/${selectedTeam.id}`, payload);
      } else {
        await api.post('/teams', payload);
      }
      setIsModalOpen(false);
      fetchTeams();
    } catch (error) {
      console.error('Erro ao salvar equipe:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTeam) return;
    try {
      setDeleting(true);
      await api.delete(`/teams/${selectedTeam.id}`);
      setIsDeleteModalOpen(false);
      setSelectedTeam(null);
      fetchTeams();
    } catch (error) {
      console.error('Erro ao excluir equipe:', error);
    } finally {
      setDeleting(false);
    }
  };

  const cargoLabels: Record<string, string> = {
    admin: 'Admin',
    gerente: 'Gerente',
    vendedor: 'Vendedor',
  };

  const cargoVariants: Record<string, 'default' | 'info' | 'warning' | 'success'> = {
    admin: 'success',
    gerente: 'warning',
    vendedor: 'info',
  };

  const columns = [
    {
      key: 'nome',
      title: 'Equipe',
      render: (team: Team) => (
        <div>
          <p className="font-medium text-foreground">{team.nome}</p>
          {team.descricao && (
            <p className="text-xs text-muted-foreground line-clamp-1">{team.descricao}</p>
          )}
        </div>
      ),
    },
    {
      key: 'lider',
      title: 'Líder',
      render: (team: Team) => (
        <div className="flex items-center gap-2">
          {team.lider ? (
            <>
              <Crown className="h-3.5 w-3.5 text-yellow-500" />
              <span className="text-muted-foreground">{team.lider.nome}</span>
            </>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </div>
      ),
    },
    {
      key: 'membros',
      title: 'Membros',
      render: (team: Team) => (
        <Badge variant="info">{team.membros?.length || 0} membros</Badge>
      ),
    },
    {
      key: 'ativo',
      title: 'Status',
      render: (team: Team) => (
        <Badge variant={team.ativo ? 'success' : 'error'}>
          {team.ativo ? 'Ativa' : 'Inativa'}
        </Badge>
      ),
    },
    {
      key: 'criadoEm',
      title: 'Criado em',
      render: (team: Team) => (
        <span className="text-muted-foreground">{formatDate(team.criadoEm)}</span>
      ),
    },
    {
      key: 'acoes',
      title: '',
      className: 'w-20',
      render: (team: Team) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); openEditModal(team); }}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); openDeleteModal(team); }}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Equipes"
        subtitle="Gerencie suas equipes, membros e permissões"
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreateModal}>
            Nova Equipe
          </Button>
        }
      />

      <div className="mb-6">
        <Input
          placeholder="Buscar equipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
          className="max-w-sm"
        />
      </div>

      <Table
        columns={columns}
        data={teams}
        loading={loading}
        emptyMessage="Nenhuma equipe encontrada"
        onRowClick={openDetailModal}
      />

      <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedTeam ? 'Editar Equipe' : 'Nova Equipe'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nome da Equipe *"
            error={errors.nome?.message}
            {...register('nome')}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Descrição
            </label>
            <textarea
              className="flex min-h-[80px] w-full rounded-lg border border-[#2a3146] bg-[#252d3f] px-3 py-2 text-sm text-white placeholder:text-[#94a3b8] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              {...register('descricao')}
            />
          </div>
          <Select
            label="Líder da Equipe"
            options={[
              { value: '', label: 'Selecione um líder' },
              ...users.map((u) => ({ value: u.id, label: `${u.nome} (${cargoLabels[u.cargo] || u.cargo})` })),
            ]}
            {...register('liderId')}
          />

          {/* Seleção de Membros */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Membros ({selectedMembers.length} selecionados)
            </label>
            <div className="max-h-48 overflow-y-auto rounded-lg border border-[#2a3146] bg-[#252d3f] p-2 space-y-1">
              {users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => toggleMember(user.id)}
                  className={`w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors ${
                    selectedMembers.includes(user.id)
                      ? 'bg-blue-500/20 text-white'
                      : 'hover:bg-[#1a1f2e] text-[#94a3b8]'
                  }`}
                >
                  {selectedMembers.includes(user.id) ? (
                    <UserMinus className="h-4 w-4 text-blue-400 shrink-0" />
                  ) : (
                    <UserPlus className="h-4 w-4 shrink-0" />
                  )}
                  <span className="text-sm">{user.nome}</span>
                  <Badge variant={cargoVariants[user.cargo] || 'default'} className="ml-auto">
                    {cargoLabels[user.cargo] || user.cargo}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              {selectedTeam ? 'Salvar Alterações' : 'Criar Equipe'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedTeam?.nome || 'Detalhes da Equipe'}
        size="lg"
      >
        {selectedTeam && (
          <div className="space-y-4">
            {selectedTeam.descricao && (
              <p className="text-sm text-muted-foreground">{selectedTeam.descricao}</p>
            )}

            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-foreground">Líder:</span>
              <span className="text-sm text-muted-foreground">
                {selectedTeam.lider?.nome || 'Sem líder definido'}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">
                Membros ({selectedTeam.membros?.length || 0})
              </h4>
              <div className="space-y-2">
                {selectedTeam.membros?.length > 0 ? (
                  selectedTeam.membros.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-[#252d3f]"
                    >
                      <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-400">
                          {member.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{member.nome}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                      <Badge variant={cargoVariants[member.cargo] || 'default'}>
                        {cargoLabels[member.cargo] || member.cargo}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum membro na equipe</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Excluir Equipe"
        size="sm"
      >
        <p className="text-sm text-muted-foreground">
          Tem certeza que deseja excluir a equipe{' '}
          <strong className="text-foreground">{selectedTeam?.nome}</strong>?
          Esta ação não pode ser desfeita.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} loading={deleting}>
            Excluir
          </Button>
        </div>
      </Modal>
    </div>
  );
}
