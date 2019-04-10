import React from 'react';
import styled from 'styled-components';
import ThemeContext from '../../context/theme_context';
import { Route, NavLink, Link } from "react-router-dom";
const StyledLink = styled(Link)`
  color: palevioletred;
  display: block;
  margin: 0.5em 0;
  font-family: Helvetica, Arial, sans-serif;

  &.${props => props.activeClassName} {
    color: red;
  }
`;
const NavCustomLink = ({ label, to, activeOnlyWhenExact, activeColor }) => {
    return (
        <Route
        path={to}
        exact={activeOnlyWhenExact}
        children={({ match }) => (
          <NavItem 
            active={match ? true : false}
            className={match ? "active" : ""}
            activeColor={activeColor}>
            <Link to={to}>{label}</Link>
          </NavItem>
        )}
      />
    );
}

const Wrapper = styled.div`
    background-color: ${props => props.backgroundColor};
    width: 18rem;
    box-shadow: 0 0 1rem black;
    z-index:1;
`;
const Header = styled.div`
    padding: 3rem 1.5rem;
`;
const TextWhite = styled.div`
    color: white;
`;
const Logo = styled(TextWhite)`
    color: white;
    font-size: 3rem;
    font-weight: bold;
`;
const Title = styled(TextWhite)`
    font-size: 1.4rem;
    font-weight: 500;
`;
const SubTitle = styled(TextWhite)`
    font-size: 1.2rem;
`;
const SideNavigation = styled.nav`
    display: flex;
    flex-direction: column;
`;
// const CustomLink = ({match, to, label, className, activeColor}) => (
    
// )
const NavItem = styled.div`
    font-size: 1.2rem;
    font-weight: 500;
    
    background-color: ${props => props.active ? props.activeColor : "transparent"};
    & a {
        padding: 1.2rem;
        padding-left: 3rem;
        display: block;
        color: white;
    }
`;
const menu_options = [
    {
        title: 'Home',
        url: '/',
        selected: true
    },
    {
        title: 'Restaurant',
        url: '/restaurants',
        selected: false
    },
    {
        title: 'Sales',
        url: '#',
        selected: false
    },
    {
        title: 'Menus',
        url: '#',
        selected: false
    },
    {
        title: 'Employees',
        url: '#',
        selected: false
    },
    {
        title: 'Customers',
        url: '#',
        selected: false
    },
    {
        title: 'Reports',
        url: '#',
        selected: false
    },
    {
        title: 'Managers',
        url: '#',
        selected: false
    },
]
const Sidebar = (props) => {
    return(
        <ThemeContext.Consumer>
            {theme => (
                    <Wrapper backgroundColor={theme.darkgrey}>
                    <Header>
                        <Logo>P</Logo>
                        <Title>WP Bar & Grill</Title>
                        <SubTitle>Rakesh Kishan</SubTitle>
                    </Header>
                    <SideNavigation>
                        {
                            menu_options.map((x, i) => (
                                // <Link
                                //     key={`nav_item_${i}`}
                                //     to={x.url}>{x.title}</Link>
                                <NavCustomLink
                                    activeColor={theme.colors.primary}
                                    key={`nav_item_${i}`}
                                    label={x.title}
                                    to={x.url}
                                    activeOnlyWhenExact={true}/>
                            ))
                        }
                        
                    </SideNavigation>
                </Wrapper>
            )}
        </ThemeContext.Consumer>
    )
}

export default Sidebar;