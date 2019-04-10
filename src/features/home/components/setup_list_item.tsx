import React, { ReactNode, Children } from 'react';
import styled from 'styled-components';
import { ThemeType } from '../../../context/theme_context';

interface PropsType {
    selected?: boolean
    theme: ThemeType
    title: string
    description?: string
    children?: ReactNode
    onClick?: EventListener
}

const ItemWrapper = styled.div`
    display: flex;
    flex-direction: row;
    padding: 1.2rem 0;
    padding-left: 10%;
    min-height: 3.8rem;
    justify-content: space-between;
    padding-right: 3rem;
    border-bottom: 1px solid ${({theme}: PropsType) => (
        theme.colors.primaryLight
    )};
    background-color: ${({selected, theme}: PropsType) => (
        selected ? theme.colors.primaryMedium : 'transparent'
    )}
    transition: all .2s;
    color: ${({theme}: PropsType) => theme.colors.text}
`;

const Title = styled.div`
    font-weight: 500;
    font-size: 1.5rem;
`;

const Description = styled.div`
    font-size: 1.2rem;    
`;

const TextWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-right: 2rem;
    width: 50%;
`;

const ChildrenWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    width: 50%;
`;

const SetupListItem = (props: PropsType) => (
    <ItemWrapper
        onClick={props.onClick}
        theme={props.theme}
        selected={props.selected}>
        <TextWrapper>
            <Title theme={props.theme}>
                {props.title}
            </Title>
            {props.description && (<Description theme={props.theme}>
                {props.description}
            </Description>)}
        </TextWrapper>
        <ChildrenWrapper>
            {props.selected && props.children}
        </ChildrenWrapper>
    </ItemWrapper>
)

export default SetupListItem;