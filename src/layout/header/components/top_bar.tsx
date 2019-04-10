import React from 'react';
import styled from 'styled-components';
import { FaBars, FaSync, FaTimes, FaGlobeAmericas, FaCog } from 'react-icons/fa';
import ThemeContext from '../../../context/theme_context';
import SearchBar from './searchbar';
import UserInfo from './user_info';
const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;
const Left = styled.div`
    display: flex
`;
const Right = styled.div`
    display: flex
`;
const ButtonsRow = styled.div`
    display: flex;
    margin-right: 3rem;
    flex-direction: row;
    width: 8rem;
    justify-content: space-between;
    color: ${props => props.color}
`;

const CongfigButtons = styled(ButtonsRow)`
    width: 6rem;
    margin-right:0
`;

const IconButton = styled.button`
    color: #666;
    display: inherit;
    justify-content: center;
    background-color: transparent;
    height: 4rem;
    width: 4rem;
    border: 0;
    padding:0;
    &:focus {
        outline: none
    }
    &:hover, &:active {
        color: inherit;
        cursor: pointer
    }
`;
const TopBar = (props) => {
    return (
        <ThemeContext.Consumer>
            {theme => (
                <Wrapper>
                    <Left>
                        <ButtonsRow
                            color={theme.primary}
                        >
                            <IconButton>
                                <FaBars/>
                            </IconButton>
                            
                        </ButtonsRow>
                    </Left>
                    
                </Wrapper>)
            }
        </ThemeContext.Consumer>
    )
}

export default TopBar;