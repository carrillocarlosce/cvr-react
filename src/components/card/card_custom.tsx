import React, { ReactNode } from 'react';
import styled from 'styled-components';

const CardWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    border: 1px solid ${props => (
        props.borderColor ? props.borderColor : '#ccc'
    ) };
    border-radius: 3px;
    box-shadow: 0 0 5px #CCC;
    background-color: white;
`;

const CardCustom = (props: PropsType) => (
    <CardWrapper 
        borderColor={props.borderColor}
    >
        {props.children}
    </CardWrapper>
)
interface PropsType {
    children: ReactNode
    borderColor: string
}
export default CardCustom;