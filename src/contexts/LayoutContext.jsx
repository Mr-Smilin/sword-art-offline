/**
 * @file LayoutContext.jsx
 * @description 管理應用布局的 Context，添加地圖模態框處理
 */
import React, { createContext, useContext, useState, useMemo } from "react";

const LayoutContext = createContext(null);

// 需要以模態框形式顯示的面板列表
const MODAL_PANELS = ["map"];

/**
 * 布局配置 Provider 組件
 */
export const LayoutProvider = ({ children }) => {
	// 布局相關狀態
	const [isMobileView, setIsMobileView] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [currentPanel, setCurrentPanel] = useState("character");
	const [isModalOpen, setIsModalOpen] = useState(false);

	// 記憶化布局操作方法
	const layoutActions = useMemo(
		() => ({
			// 切換導航選單
			toggleMenu: () => {
				setIsMenuOpen((prev) => !prev);
			},

			// 關閉導航選單
			closeMenu: () => {
				setIsMenuOpen(false);
			},

			// 切換面板
			switchPanel: (panelId) => {
				setCurrentPanel(panelId);
				// 檢查是否為需要模態框顯示的面板
				setIsModalOpen(MODAL_PANELS.includes(panelId));
				// 在切換面板時自動關閉選單
				if (isMobileView) {
					setIsMenuOpen(false);
				}
			},

			// 關閉模態框
			closeModal: () => {
				setIsModalOpen(false);
				// 如果當前面板是模態框類型，切換回預設面板
				if (MODAL_PANELS.includes(currentPanel)) {
					setCurrentPanel("character");
				}
			},

			// 設置移動設備視圖狀態
			setMobileView: (isMobile) => {
				setIsMobileView(isMobile);
				if (isMobile) {
					setIsMenuOpen(false);
				}
			},
		}),
		[isMobileView, currentPanel]
	);

	// 記憶化主內容區域樣式配置
	const mainContentStyles = useMemo(
		() => ({
			main: {
				flexGrow: 1,
				p: 3,
				mt: 8,
				transition: (theme) =>
					theme.transitions.create(["margin", "width"], {
						easing: theme.transitions.easing.sharp,
						duration: theme.transitions.duration.standard,
					}),
			},
			contentGrid: {
				display: "grid",
				gap: 2,
				gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
				gridTemplateRows: "auto",
				opacity: isMenuOpen ? 0.3 : 1,
				transition: "opacity 0.3s ease-in-out",
				filter: isMenuOpen ? "blur(2px)" : "none",
			},
			modal: {
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				"& .MuiPaper-root": {
					position: "relative",
					width: "90%",
					maxWidth: 1200,
					maxHeight: "90vh",
					overflow: "auto",
					p: 4,
					outline: "none",
					bgcolor: "background.paper",
				},
			},
		}),
		[isMenuOpen]
	);

	const value = {
		// 狀態
		isMobileView,
		isMenuOpen,
		currentPanel,
		isModalOpen,
		// 樣式配置
		mainContentStyles,
		// 操作方法
		layoutActions,
		// 工具方法
		isModalPanel: (panelId) => MODAL_PANELS.includes(panelId),
	};

	return (
		<LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
	);
};

export const useLayout = () => {
	const context = useContext(LayoutContext);
	if (!context) {
		throw new Error("useLayout must be used within a LayoutProvider");
	}
	return context;
};
