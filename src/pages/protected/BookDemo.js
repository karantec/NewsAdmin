import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import BookDemo from '../../features/BookDemo'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Blog Post" }))
      }, [])


    return(
        <BookDemo/>
    )
}

export default InternalPage