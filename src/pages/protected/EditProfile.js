import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import EditProfile from '../../features/settings/EditProfile'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Edit Profile" }))
      }, [])


    return(
        <EditProfile />
    )
}

export default InternalPage