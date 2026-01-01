
import { useNavigate } from 'react-router-dom';


const Temp = () => {
   const navigate = useNavigate();

   const handleNavigate = () =>{
    navigate("/contact");
   }
        
    
  return (
    <div>
        
      <button
onClick={handleNavigate}
      className='bg-black text-white'

>
        Add New
      </button>
    </div>
  )
}

export default Temp;
