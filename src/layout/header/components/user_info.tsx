import React from 'react';
import styled from 'styled-components';
import { FaSearch, FaArrowDown, FaCaretDown } from 'react-icons/fa';
import ThemeContext from '../../../context/theme_context';

const Wrapper = styled.div`
    display: flex;
    color: #666;
`;

const UserPicture = styled.img`
    justify-content: center;
    background-color: transparent;
    height: 2rem;
    width: 2rem;
    border-radius: 3rem;
    margin-right: 1rem;
`;
const TextWrapper = styled(Wrapper)`
    flex-direction: row;
    margin-right: 2rem;
    align-items: center;
    line-height: 1;
`;
const Text = styled.span`
    font-weight: bold;
    font-size: 1.2rem;
`;

const CaretDown = styled.span`
    margin: 0 .5rem
`;
const UserInfo = (props) => {
    return (
        <ThemeContext.Consumer>
            {theme => (
                <Wrapper>
                    <UserPicture src="https://via.placeholder.com/50x50"/>
                    <TextWrapper>
                        <Text>carrillocarlosce@gmail.com</Text>
                        <CaretDown>
                            <FaCaretDown/>
                        </CaretDown>
                    </TextWrapper>
                </Wrapper>)
            }
        </ThemeContext.Consumer>
    )
}

export default UserInfo;