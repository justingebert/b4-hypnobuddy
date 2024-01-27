import styles from '../styles/TherapistCard.module.scss'

function NewFearModal({ isOpen, onClose, onSave, fearTitle, onTitleChange }) {
    if (!isOpen) {
        return null;
    }

    const handleSaveClick = () => {
        onSave();
    };

    const handleTitleChange = (e) => {
        onTitleChange(e.target.value);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2>Neue Kategorie</h2>
                    <button onClick={onClose}>&times;</button>
                </div>
                <div className={styles.modalBody}>
                    <label>
                        <input type="text"
                               value={fearTitle}
                               onChange={handleTitleChange}
                               placeholder="Titel"
                               required={true}
                               style={{ width: '180%' }}/>
                    </label>
                </div>
                <div className={styles.modalFooter}>
                    <button onClick={handleSaveClick}>Save</button>
                </div>
            </div>
        </div>
    );
}

export default NewFearModal;
