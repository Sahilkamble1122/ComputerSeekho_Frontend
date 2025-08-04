import Footer from '../footer/components/Footer'
import Navbar from '../home/components/Navbar'
import Faculty from './components/Faculty'

const page = () => {
  return (
    <div>
    <Navbar/>
      <Faculty/>
      <Footer/>
    </div>
  )
}

export default page
