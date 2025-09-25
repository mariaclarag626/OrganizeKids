'use client'

export default function DashboardPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 sm:p-6 lg:p-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-6 sm:mb-8 px-4 sm:px-0'>
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4'>
            Welcome to OrganizeKids Dashboard! 🎉
          </h1>
          <p className='text-blue-200 text-sm sm:text-base lg:text-lg'>
            Your family organization hub is ready to go!
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
          {/* Tasks Card */}
          <div className='bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20'>
            <div className='text-center'>
              <div className='text-3xl sm:text-4xl mb-3 sm:mb-4'>📝</div>
              <h3 className='text-lg sm:text-xl font-semibold text-white mb-2'>Tasks</h3>
              <p className='text-blue-200 text-xs sm:text-sm mb-3 sm:mb-4'>
                Manage family tasks and chores
              </p>
              <button className='w-full py-2 px-3 sm:px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base'>
                View Tasks
              </button>
            </div>
          </div>

          {/* Calendar Card */}
          <div className='bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20'>
            <div className='text-center'>
              <div className='text-3xl sm:text-4xl mb-3 sm:mb-4'>📅</div>
              <h3 className='text-lg sm:text-xl font-semibold text-white mb-2'>Calendar</h3>
              <p className='text-blue-200 text-xs sm:text-sm mb-3 sm:mb-4'>
                Family events and schedules
              </p>
              <button className='w-full py-2 px-3 sm:px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm sm:text-base'>
                View Calendar
              </button>
            </div>
          </div>

          {/* Rewards Card */}
          <div className='bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20'>
            <div className='text-center'>
              <div className='text-3xl sm:text-4xl mb-3 sm:mb-4'>🏆</div>
              <h3 className='text-lg sm:text-xl font-semibold text-white mb-2'>Rewards</h3>
              <p className='text-blue-200 text-xs sm:text-sm mb-3 sm:mb-4'>
                Track achievements and rewards
              </p>
              <button className='w-full py-2 px-3 sm:px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm sm:text-base'>
                View Rewards
              </button>
            </div>
          </div>

          {/* Family Members Card */}
          <div className='bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20'>
            <div className='text-center'>
              <div className='text-3xl sm:text-4xl mb-3 sm:mb-4'>👨‍👩‍👧‍👦</div>
              <h3 className='text-lg sm:text-xl font-semibold text-white mb-2'>Family</h3>
              <p className='text-blue-200 text-xs sm:text-sm mb-3 sm:mb-4'>
                Manage family members
              </p>
              <button className='w-full py-2 px-3 sm:px-4 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors text-sm sm:text-base'>
                View Family
              </button>
            </div>
          </div>

          {/* Settings Card */}
          <div className='bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20'>
            <div className='text-center'>
              <div className='text-3xl sm:text-4xl mb-3 sm:mb-4'>⚙️</div>
              <h3 className='text-lg sm:text-xl font-semibold text-white mb-2'>Settings</h3>
              <p className='text-blue-200 text-xs sm:text-sm mb-3 sm:mb-4'>
                Configure your preferences
              </p>
              <button className='w-full py-2 px-3 sm:px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm sm:text-base'>
                View Settings
              </button>
            </div>
          </div>

          {/* Progress Card */}
          <div className='bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20'>
            <div className='text-center'>
              <div className='text-3xl sm:text-4xl mb-3 sm:mb-4'>📊</div>
              <h3 className='text-lg sm:text-xl font-semibold text-white mb-2'>Progress</h3>
              <p className='text-blue-200 text-xs sm:text-sm mb-3 sm:mb-4'>
                View family progress stats
              </p>
              <button className='w-full py-2 px-3 sm:px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm sm:text-base'>
                View Progress
              </button>
            </div>
          </div>
        </div>

        <div className='mt-8 text-center'>
          <button
            className='py-2 px-6 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors'
            onClick={() => window.location.href = '/'}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
