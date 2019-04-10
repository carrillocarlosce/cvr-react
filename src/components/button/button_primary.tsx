import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { ThemeType } from '../../context/theme_context';
import ButtonBase from './button_base';

interface PropsType {
    children: ReactNode
    theme: ThemeType
    className?: any
}
const ButtonStyled = styled(ButtonBase)`
    background-color: ${({theme}: PropsType) =>(
        theme.colors.primary
    )}
    color: white;
`;
const ButtonPrimary = (props: PropsType) => (
    <ButtonStyled
        className={props.className}
        theme={props.theme}
    >
        {props.children}
    </ButtonStyled>
)

export default ButtonPrimary;