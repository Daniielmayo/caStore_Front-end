"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import clsx from "clsx";
import { AuthLayout } from "../components/AuthLayout";
import { AuthForm } from "../components/AuthForm";
import styles from "./Login.module.css";
import { useRouter } from "next/navigation";

import { useAuthStore } from "../../../store/auth.store";

const loginSchema = z.object({
  email: z.string().email("Ingresa un correo electrónico válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const loginAction = useAuthStore((state) => state.loginAction);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await loginAction(data);
      
      // Obtener el usuario del estado para verificar firstLogin
      const user = useAuthStore.getState().user;
      
      if (user?.firstLogin) {
        router.push("/change-password");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      // Mapeo de errores especificado
      if (err.message.includes("401") || err.message.toLowerCase().includes("incorrect")) {
        setError("Credenciales incorrectas. Intenta de nuevo.");
      } else if (err.message.includes("403") || err.message.toLowerCase().includes("deactivated")) {
        setError("Tu cuenta está desactivada.");
      } else {
        setError("Error al iniciar sesión. Intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Iniciar sesión
        </h2>
        <p className={styles.subtitle}>
          Construyendo autos con amor
        </p>
      </div>

      <AuthForm onSubmit={handleSubmit(onSubmit)} isLoading={isLoading}>
        {/* Email Field */}
        <div className={styles.fieldWrapper}>
          <label htmlFor="email" className={styles.label}>
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            placeholder="roberto@castore.com"
            {...register("email")}
            className={clsx(styles.input, { [styles.inputError]: !!errors.email })}
          />
          {errors.email && (
            <span className={styles.errorText}>
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Password Field */}
        <div className={styles.fieldWrapper}>
          <label
            htmlFor="password"
            className={styles.label}
          >
            Contraseña
          </label>
          <div className={styles.inputRelative}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className={clsx(styles.input, styles.inputWithIcon, { [styles.inputError]: !!errors.password })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.iconButton}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <span className={styles.errorText}>
              {errors.password.message}
            </span>
          )}
        </div>

        {error && (
          <div className={styles.alertError}>
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p className="m-0 break-words">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className={styles.actionsWrapper}>
          <button
            type="submit"
            disabled={isLoading}
            className={styles.primaryButton}
          >
            {isLoading ? (
              <span className={styles.loadingContent}>
                <svg
                  className={styles.spinner}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className={styles.spinnerCircle}
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className={styles.spinnerPath}
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Iniciando sesión...
              </span>
            ) : (
              "Iniciar sesión"
            )}
          </button>

          <a
            href="/recover-password"
            className={styles.secondaryLink}
          >
            Recuperar contraseña
          </a>
        </div>
      </AuthForm>
    </AuthLayout>
  );
}
