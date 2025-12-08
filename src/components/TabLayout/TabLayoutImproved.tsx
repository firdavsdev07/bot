import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Keyboard } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/swiper-bundle.css";
import { Box, Tab, Tabs, Badge, useMediaQuery, useTheme } from "@mui/material";
import { tabRoutes } from "../../layouts/tabRoutes";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { getUnreadCount } from "../../store/actions/notificationActions";
import { responsive } from "../../theme/responsive";

const TabLayoutImproved = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  const [tabIndex, setTabIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const { unreadCount } = useSelector((state: RootState) => state.notification);

  // Fetch unread count on mount
  useEffect(() => {
    dispatch(getUnreadCount() as any);
  }, [dispatch]);

  useEffect(() => {
    const currentIndex = tabRoutes.findIndex(
      (tab) => location.pathname === tab.path
    );
    if (currentIndex !== -1) {
      setTabIndex(currentIndex);
      swiperInstance?.slideTo(currentIndex);
    }
  }, [location.pathname, swiperInstance]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    navigate(tabRoutes[newValue].path);
  };

  const handleSwipe = (swiper: SwiperType) => {
    const newIndex = swiper.activeIndex;
    setTabIndex(newIndex);
    navigate(tabRoutes[newIndex].path);
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Fixed Header - Mobile optimized */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          width: "100%",
          bgcolor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          zIndex: 1000,
          px: { xs: 0.5, sm: 1, md: 2 },
          pt: { xs: 0.5, sm: 1 },
          pb: { xs: 0.5, sm: 1 },
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            mt: { xs: 0.5, sm: 1 },
            minHeight: { xs: 48, sm: 56 },
            "& .MuiTab-root": {
              fontWeight: 600,
              fontSize: responsive.typography.caption,
              textTransform: "none",
              minHeight: { xs: 44, sm: 48 },
              transition: "all 0.3s ease",
              px: { xs: 0.5, sm: 1 },
              // Better mobile spacing
              "& .MuiTab-iconWrapper": {
                marginRight: { xs: 0.5, sm: 0.8 },
                marginBottom: "0 !important",
              }
            },
            "& .Mui-selected": {
              color: "primary.main",
            },
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "3px 3px 0 0",
            },
          }}
        >
          {tabRoutes.map((tab, idx) => {
            const Icon = tab.icon;
            const showBadge = tab.showBadge && unreadCount > 0;
            
            // Smart label truncation for mobile
            const getLabel = (label: string) => {
              if (isMobile && label.length > 8) {
                return label.slice(0, 6) + "..";
              }
              return label;
            };
            
            return (
              <Tab
                key={idx}
                label={getLabel(tab.label)}
                icon={
                  showBadge ? (
                    <Badge 
                      badgeContent={unreadCount > 99 ? "99+" : unreadCount} 
                      color="error"
                      sx={{
                        "& .MuiBadge-badge": {
                          fontSize: responsive.typography.caption.xs,
                          height: { xs: 16, sm: 18 },
                          minWidth: { xs: 16, sm: 18 },
                          padding: "0 4px",
                          fontWeight: 700,
                        }
                      }}
                    >
                      <Icon size={responsive.icon.small.xs} />
                    </Badge>
                  ) : (
                    <Icon size={responsive.icon.small.xs} />
                  )
                }
                iconPosition="start"
                sx={{
                  minHeight: { xs: 44, sm: 48 },
                  fontSize: responsive.typography.caption,
                }}
              />
            );
          })}
        </Tabs>
      </Box>

      {/* Content Area - Responsive padding */}
      <Box sx={{ 
        flex: 1, 
        pt: { xs: 7, sm: 8, md: 9 }, // Account for header height
        pb: 1,
      }}>
        <Swiper
          modules={[Mousewheel, Keyboard]}
          spaceBetween={0}
          slidesPerView={1}
          initialSlide={tabIndex}
          onSwiper={setSwiperInstance}
          onSlideChange={handleSwipe}
          mousewheel={!isMobile} // Disable mousewheel on mobile
          keyboard={{ enabled: !isMobile }}
          touchStartPreventDefault={false}
          style={{ height: "100%" }}
        >
          {tabRoutes.map((route, idx) => {
            const Component = route.component;
            return (
              <SwiperSlide
                key={idx}
                style={{ 
                  height: "auto", 
                  overflowY: "auto",
                }}
              >
                <Box
                  sx={{
                    height: "calc(100vh - 64px)", // Adjust for header
                    overflowY: "auto",
                    overflowX: "hidden",
                    py: responsive.spacing.container,
                    px: { xs: 0.5, sm: 1 }, // Minimal horizontal padding
                    scrollbarGutter: "stable",
                    // Custom scrollbar for mobile
                    scrollbarWidth: "thin",
                    "&::-webkit-scrollbar": {
                      width: { xs: "2px", sm: "4px" },
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "rgba(0,0,0,0.2)",
                      borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <Component activeTabIndex={tabIndex} index={idx} />
                </Box>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Box>
    </Box>
  );
};

export default TabLayoutImproved;