import styles from './styles/Button.module.css';

const Button = ({
    children = 'Button',
    type = 'submit',
    style = {}, 
    variant,
    onClick,
}) => {
    const buttonVariant = variant ? styles[variant] : '';
    return (
        <button
            onClick={onClick}
            style={style}
            className={`${styles.button} ${buttonVariant}`}
            type={type}
        >
            {children}
        </button>
    );
};

export default Button;
