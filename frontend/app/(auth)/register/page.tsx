'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const registerSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmarSenha: z.string(),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: 'Senhas não conferem',
  path: ['confirmarSenha'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError('');
      await registerUser({
        nome: data.nome,
        email: data.email,
        senha: data.senha,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar conta');
    }
  };

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Card principal */}
      <div className="rounded-xl border border-[#2a3146] bg-[#1a1f2e] p-8">
        {/* Ícone */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#2a3146] bg-[#252d3f]">
            <svg className="h-7 w-7 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
        </div>

        {/* Título */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">Criar Conta</h1>
          <p className="mt-1 text-sm text-[#94a3b8]">Preencha os dados para começar</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Nome completo
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <User className="h-4 w-4 text-[#94a3b8]" />
              </div>
              <input
                type="text"
                placeholder="Seu nome"
                className="h-12 w-full rounded-lg border border-[#2a3146] bg-[#252d3f] pl-11 pr-4 text-sm text-white placeholder:text-[#94a3b8] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                {...register('nome')}
              />
            </div>
            {errors.nome && (
              <p className="mt-1.5 text-xs text-red-400">{errors.nome.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Email
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Mail className="h-4 w-4 text-[#94a3b8]" />
              </div>
              <input
                type="email"
                placeholder="seu@email.com"
                className="h-12 w-full rounded-lg border border-[#2a3146] bg-[#252d3f] pl-11 pr-4 text-sm text-white placeholder:text-[#94a3b8] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Senha */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Senha
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Lock className="h-4 w-4 text-[#94a3b8]" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 6 caracteres"
                className="h-12 w-full rounded-lg border border-[#2a3146] bg-[#252d3f] pl-11 pr-12 text-sm text-white placeholder:text-[#94a3b8] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                {...register('senha')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#94a3b8] hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.senha && (
              <p className="mt-1.5 text-xs text-red-400">{errors.senha.message}</p>
            )}
          </div>

          {/* Confirmar Senha */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Confirmar senha
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Lock className="h-4 w-4 text-[#94a3b8]" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Repita a senha"
                className="h-12 w-full rounded-lg border border-[#2a3146] bg-[#252d3f] pl-11 pr-4 text-sm text-white placeholder:text-[#94a3b8] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                {...register('confirmarSenha')}
              />
            </div>
            {errors.confirmarSenha && (
              <p className="mt-1.5 text-xs text-red-400">{errors.confirmarSenha.message}</p>
            )}
          </div>

          {/* Botão Criar conta */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-lg bg-blue-600 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Criando...
              </span>
            ) : (
              'Criar conta'
            )}
          </button>
        </form>

        {/* Link para login */}
        <p className="mt-6 text-center text-sm text-[#94a3b8]">
          Já tem uma conta?{' '}
          <Link
            href="/login"
            className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
          >
            Fazer login
          </Link>
        </p>
      </div>

      {/* Rodapé */}
      <p className="text-center text-sm text-[#94a3b8]">
        Plataforma de Atendimento ao Cliente
      </p>
    </div>
  );
}
