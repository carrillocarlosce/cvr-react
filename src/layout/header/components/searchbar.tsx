import React from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import ThemeContext from '../../../context/theme_context';

const Wrapper = styled.div`
    display: flex;
    color: #666;
`;

const IconWrapper = styled.button`
    color: inherit;
    display: inherit;
    justify-content: center;
    background-color: transparent;
    height: 2rem;
    width: 2rem;
    border: 0;
    padding:0;
    &:hover {
        color: ${props => props.color};

    }
`;
const InputSearch = styled.input`
    border: 0;
    padding-left: 1rem;
    font-weight: bold;
    color: inherit;
    &:active, &:focus {
        border: 0;
        outline: 0;
    }
`;
const SearchBar = (props) => {
    return (
        <ThemeContext.Consumer>
            {theme => (
                <Wrapper>
                    <IconWrapper>
                        <FaSearch/>
                    </IconWrapper>
                    <InputSearch 
                        type="text" 
                        placeholder="Search Dashboard"
                    />
                </Wrapper>)
            }
        </ThemeContext.Consumer>
    )
}

export default SearchBar;