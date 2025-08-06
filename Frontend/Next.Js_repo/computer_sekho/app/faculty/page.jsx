import Footer from '../footer/components/Footer'
import Navcomponent from '../home/components/Navcomponent'
import Faculty from './components/Faculty'

const page = () => {
  return (
    <div>
    <Navcomponent/>
      <Faculty/>
      <Footer/>
    </div>
  )
}

export default page
