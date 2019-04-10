import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface PropsType {
    children: ReactNode
  }

const CardBodyWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;
const CardBody = (props: PropsType) => (
    <CardBodyWrapper>
        {props.children}
    </CardBodyWrapper>
)

export default CardBody;