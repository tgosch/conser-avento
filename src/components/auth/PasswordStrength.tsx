export default function PasswordStrength({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]
  const score = checks.filter(Boolean).length
  const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e']
  const labels = ['', 'Schwach', 'Mittel', 'Gut', 'Stark']
  if (!password) return null
  return (
    <div className="mt-1">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= score ? colors[score] : 'var(--surface3)' }} />
        ))}
      </div>
      <p className="text-xs" style={{ color: score <= 1 ? '#ef4444' : score === 2 ? '#f97316' : score === 3 ? '#eab308' : '#22c55e' }}>
        {labels[score]}
      </p>
    </div>
  )
}
