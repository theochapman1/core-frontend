import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import useOnMount from '$shared/hooks/useOnMount'
import useFailure from '$shared/hooks/useFailure'
import { stopSession } from '$app/src/reducers/session'
import routes from '$routes'

const LogoutPage = () => {
    const fail = useFailure()

    const dispatch = useDispatch()

    const history = useHistory()

    useOnMount(async () => {
        try {
            await dispatch(stopSession())
            history.push(routes.root())
        } catch (e) {
            fail(e)
        }
    })

    return null
}

export default LogoutPage
