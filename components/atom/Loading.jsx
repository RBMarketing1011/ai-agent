
const Loading = ({ color = 'white' }) =>
{
  return (
    <div class={ `w-8 h-8 border-4 border-${ color } border-t-transparent rounded-full animate-spin-fast` }></div>

  )
}

export default Loading