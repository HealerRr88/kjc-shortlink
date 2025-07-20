import loadingIcon from '../../../assets/images/loading-icon.webp';

export default function PageLoading() {
    return (
        <div className="w-100 d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
            <img style={{ width: '200px' }} src={loadingIcon} alt="loading-icon" />
        </div>
    )
}