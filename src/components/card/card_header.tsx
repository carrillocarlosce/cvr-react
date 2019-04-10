import React from 'react';
import styled from 'styled-components';

const CardHeaderWrapper = styled.div`
    display: flex;
    flex-direction: row;
    padding: 1.2rem 3rem;
    border-bottom: 1px solid ${props => props.borderColor};
`;

const CardHeader = (props: PropsType) => (
    <CardHeaderWrapper borderColor={props.borderColor}>
        {props.children}
    </CardHeaderWrapper>
)

interface PropsType {
  children: JSX.Element
  borderColor: string
}

export default CardHeader;