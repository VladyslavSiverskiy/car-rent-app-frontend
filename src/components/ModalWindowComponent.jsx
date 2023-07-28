import './styles/Modal.css';
import './styles/CarRentalApp.css';


export default function ModalWindowComponent({ message }) {
    return (
        <div className="modal-window">
            <div className="modal-window_content">
                <img className="modal-window_loading" src="/img/loader2.gif" alt="Loading" />
                {message && <div className="modal-window_message">{message}</div>}
                {!message && <div className="modal-window_message">Please wait...</div>}
            </div>
        </div>
    );
}