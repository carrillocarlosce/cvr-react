import React from 'react';
import styled from 'styled-components';
import ThemeContext from '../../../context/theme_context';

const Wrapper = styled.div`
    padding-bottom: 2rem;
    padding-top: 3rem;
    display: flex;
    justify-content: space-between;
`;
const Left = styled.div`
    display: flex
`;
const Right = styled.div`
    display: flex
`;

const Title = styled.span`
    font-size: 3rem;
    color: #666;
    font-weight: 500
`;
const TitleBar = (props) => {
    return (
        <ThemeContext.Consumer>
            {theme => (
                <Wrapper>
                    <Left>
                        <Title>
                        Welcome, Nicholas Brunner
                        </Title>
                    </Left>
                    <Right>
                        
                    </Right>
                </Wrapper>)
            }
        </ThemeContext.Consumer>
    )
}

export default TitleBar;