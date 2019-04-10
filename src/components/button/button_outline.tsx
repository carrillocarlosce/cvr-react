import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { ThemeType } from '../../context/theme_context';
import ButtonBase from './button_base';

interface PropsType {
    children: ReactNode
    theme: ThemeType
}

const ButtonStyled = styled(ButtonBase)`
    border: 2px solid ${({theme}: PropsType) =>(
        theme.colors.primary
    )};
    color: ${({theme}: PropsType) =>(
        theme.colors.primary
    )};
`;

const ButtonOutline = (props: PropsType) => (
    <ButtonStyled
        theme={props.theme}
    >
        {props.children}
    </ButtonStyled>
)

export default ButtonOutline;