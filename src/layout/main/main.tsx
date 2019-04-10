import React from 'react';
import styled from 'styled-components';
const Wrapper = styled.div`
    flex-grow: 1
`;
const Main = ({children}) => {
    return (
        <Wrapper>{children}</Wrapper>
    )
}

export default Main;