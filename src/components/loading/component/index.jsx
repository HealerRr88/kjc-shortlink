import component_loading_icon from '../../../assets/images/component-loading-icon.gif';

export default function ComponentLoading(){
  return (
    <div className="w-100 h-100 d-flex align-items-center justify-content-center">
      <img style={{width: 100}} src={component_loading_icon} alt="loading-icon"/>
    </div>
  )
}