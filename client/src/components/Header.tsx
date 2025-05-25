import React, { useState } from 'react';
import styled from 'styled-components';
import { FaBell, FaUser, FaSearch, FaBars, FaTimes } from 'react-icons/fa';

const HeaderContainer = styled.header`
  background-color: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 90;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--text-dark);
  margin-right: 1rem;
  font-size: 1.2rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Logo = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary);
`;

const SearchBar = styled.div`
  position: relative;
  flex: 1;
  max-width: 500px;
  margin: 0 2rem;
  
  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-light);
  }
  
  @media (max-width: 768px) {
    margin: 0 1rem;
    max-width: none;
  }
  
  @media (max-width: 576px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2.25rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 0.9rem;
  outline: none;
  
  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.1);
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--text-light);
  margin-left: 1rem;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  svg {
    font-size: 1.25rem;
  }
  
  @media (max-width: 576px) {
    margin-left: 0.5rem;
  }
`;

const UserButton = styled(ActionButton)`
  background-color: var(--primary);
  color: white;
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

interface HeaderProps {
  toggleMobileMenu: () => void;
  mobileMenuOpen: boolean;
  onSearch?: (query: string) => void;
}

const Header = ({ toggleMobileMenu, mobileMenuOpen, onSearch }: HeaderProps) => {
  const [search, setSearch] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <HeaderContainer>
      <LogoSection>
        <MobileMenuButton onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuButton>
        <Logo>DS Tarefas</Logo>
      </LogoSection>
      
      <SearchBar>
        <FaSearch />
        <SearchInput
          placeholder="Procurar por tarefa..."
          value={search}
          onChange={handleInputChange}
        />
      </SearchBar>
      
      <Actions>
        <ActionButton>
          <FaBell />
        </ActionButton>
        <UserButton>
          <FaUser />
        </UserButton>
      </Actions>
    </HeaderContainer>
  );
};

export default Header;