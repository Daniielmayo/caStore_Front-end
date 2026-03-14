"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import clsx from "clsx";

import styles from "./ResetPassword.module.css";
import { AuthLayout } from "../components/AuthLayout";
import { AuthForm } from "../components/AuthForm";

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, "Debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[0-9]/, "Debe contener al menos un número")
      .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial"),
    confirmPassword: z.string().min(1, "Confirmar contraseña es obligatorio"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    mode: "onChange",
  });

  const passwordValue = watch("password") || "";

  const requirements = [
    { label: "Mínimo 8 caracteres", isMet: passwordValue.length >= 8 },
    { label: "Una letra mayúscula", isMet: /[A-Z]/.test(passwordValue) },
    { label: "Un número", isMet: /[0-9]/.test(passwordValue) },
    {
      label: "Un carácter especial",
      isMet: /[^A-Za-z0-9]/.test(passwordValue),
    },
  ];

  const onSubmit = async (data: ResetFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
    } catch (err: any) {
      setError(
        err.message ||
          "Error al cambiar la contraseña. El enlace pudo haber expirado.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSuccess && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isSuccess && countdown === 0) {
      // Redirigir al login o dashboard aquí
      console.log("Redirecting to dashboard...");
      window.location.href = "/login";
    }
    return () => clearTimeout(timer);
  }, [isSuccess, countdown]);

  return (
    <AuthLayout>
      <div className={styles.pageWrapper}>
        <h2 className={styles.title}>Nueva contraseña</h2>
        <p className={styles.subtitle}>
          Elige una contraseña segura para tu cuenta
        </p>
      </div>

      {isSuccess ? (
        <div className="flex flex-col">
          <div className={styles.successCard}>
            <CheckCircle2 className={styles.successIcon} />
            <p className={styles.successTitle}>
              Contraseña guardada correctamente.
            </p>
            <p className={styles.successText}>Redirigiendo en {countdown}...</p>
          </div>
        </div>
      ) : (
        <AuthForm onSubmit={handleSubmit(onSubmit)} isLoading={isLoading}>
          {/* New Password Field */}
          <div className={styles.fieldWrapper}>
            <label htmlFor="password" className={styles.label}>
              Nueva contraseña
            </label>
            <div className={styles.inputRelative}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className={clsx(styles.input, {
                  [styles.inputError]: !!errors.password,
                })}
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
          </div>

          {/* Password Strength Checklist */}
          <ul className={styles.checklist}>
            {requirements.map((req, i) => (
              <li
                key={i}
                className={clsx(
                  styles.checkItem,
                  req.isMet ? styles.checkMet : styles.checkUnmet,
                )}
              >
                {req.isMet ? (
                  <CheckCircle2 className={styles.checkIcon} />
                ) : (
                  <XCircle className={styles.checkIcon} />
                )}
                <span>{req.label}</span>
              </li>
            ))}
          </ul>

          {/* Confirm Password Field */}
          <div className={styles.fieldWrapper}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirmar contraseña
            </label>
            <div className={styles.inputRelative}>
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                {...register("confirmPassword")}
                className={clsx(styles.input, {
                  [styles.inputError]: !!errors.confirmPassword,
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className={styles.iconButton}
                tabIndex={-1}
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className={styles.errorFieldText}>
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          {error && (
            <div className={styles.alertError}>
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p className="m-0 break-words">{error}</p>
            </div>
          )}

          {/* Action */}
          <div className={styles.actionsWrapper}>
            <button
              type="submit"
              disabled={isLoading || !requirements.every((r) => r.isMet)}
              className={styles.primaryButton}
            >
              {isLoading ? "Cambiando contraseña..." : "Cambiar contraseña"}
            </button>
          </div>
        </AuthForm>
      )}
    </AuthLayout>
  );
}
