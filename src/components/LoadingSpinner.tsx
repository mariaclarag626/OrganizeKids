export default function LoadingSpinner({ size = 'md', color = 'blue' }: { 
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'green' | 'purple' | 'yellow'
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const colorClasses = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    purple: 'border-purple-500',
    yellow: 'border-yellow-500'
  }

  return (
    <div className={`${sizeClasses[size]} border-4 ${colorClasses[color]} border-t-transparent rounded-full animate-spin`} />
  )
}
