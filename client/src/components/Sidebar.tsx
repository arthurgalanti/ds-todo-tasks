import { useState } from 'react';
import styled from 'styled-components';
import { FaInbox, FaCalendarAlt, FaClipboardList, FaTags, FaRegClock, FaBars, FaTimes } from 'react-icons/fa';

const SidebarContainer = styled.aside<{ isOpen: boolean }>`
  width: 250px;
  background-color: white;
  box-shadow: 1px 0 3px rgba(0,0,0,0.05);
  padding: 1.5rem 0;
  height: 100%;
  position: fixed;
  left: 0;
  top: 60px;
  z-index: 100;
  transition: transform 0.3s ease;
  
  @media (max-width: 768px) {
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    width: 240px;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-dark);
  cursor: pointer;
  padding: 0.5rem;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const SidebarSection = styled.div`
  margin-bottom: 2rem;
  
  h3 {
    font-size: 0.8rem;
    text-transform: uppercase;
    color: var(--text-light);
    padding: 0 1.5rem;
    margin-bottom: 0.75rem;
  }
`;

const SidebarLink = styled.a<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: ${props => props.active ? 'var(--primary)' : 'var(--text-dark)'};
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s;
  background-color: ${props => props.active ? 'rgba(255, 107, 107, 0.05)' : 'transparent'};

  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
    color: var(--primary);
  }
  
  svg {
    margin-right: 0.75rem;
  }
`;

const SidebarOverlay = styled.div<{ isOpen: boolean }>`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

interface SidebarProps {
  mobileOpen?: boolean;
  toggleMobileMenu?: () => void;
}

const Sidebar = ({ mobileOpen = false, toggleMobileMenu = () => {} }: SidebarProps) => {
  return (
    <>
      <SidebarContainer isOpen={mobileOpen}>
        <SidebarSection>
          <h3>Tarefas</h3>
          <SidebarLink href="#" active>
            <FaInbox /> Todas
          </SidebarLink>
        </SidebarSection>
      </SidebarContainer>

      <SidebarOverlay isOpen={mobileOpen} onClick={toggleMobileMenu} />
    </>
  );
};

export default Sidebar;