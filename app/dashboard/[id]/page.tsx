import ListInformation from '@/app/components/usuario-phone'
import Usuarios from '@/app/components/usuario';

export default function UserInformation() {

    return(
        <>
        <div className='hidden md:block'><Usuarios/></div>
        <div className='block md:hidden'><ListInformation/></div>
        </>
    );
}