import Navbar from './Navbar'
import Navtop from './Navtop'

const Navcomponent = () => {
  return (
    <div className='fixed top-0 left-0 w-full z-50'>
      <Navtop/>
      <Navbar/>
    </div>
  )
}

export default Navcomponent
