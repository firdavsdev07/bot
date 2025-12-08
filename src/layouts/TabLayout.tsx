import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Keyboard } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/swiper-bundle.css";
import { Box, Tab, Tabs, Badge } from "@mui/material";
import { tabRoutes } from "./tabRoutes";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { getUnreadCount } from "../store/actions/notificationActions";

const TabsLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
      <Box
        sx={{
          position: "fixed",
          top: 0,
          width: "100%",
          bgcolor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          zIndex: 1000,
          px: { xs: 0.5, sm: 1, md: 2 },
          pt: { xs: 0.5, sm: 1 },
          pb: { xs: 0.5, sm: 1 },
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            mt: 1,
            "& .MuiTab-root": {
              fontWeight: 600,
              fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
              textTransform: "none",
              minHeight: { xs: 40, sm: 44, md: 48 },
              transition: "all 0.3s ease",
              px: { xs: 0.5, sm: 1 },
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
            
            return (
              <Tab
                key={idx}
                label={tab.label}
                icon={
                  showBadge ? (
                    <Badge 
                      badgeContent={unreadCount} 
                      color="error"
                      sx={{
                        "& .MuiBadge-badge": {
                          fontSize: { xs: "0.6rem", sm: "0.65rem" },
                          height: { xs: 16, sm: 18 },
                          minWidth: { xs: 16, sm: 18 },
                          padding: "0 4px",
                          fontWeight: 700,
                        }
                      }}
                    >
                      <Icon size={window.innerWidth < 768 ? 18 : 20} />
                    </Badge>
                  ) : (
                    <Icon size={window.innerWidth < 768 ? 18 : 20} />
                  )
                }
                iconPosition="start"
                sx={{
                  minHeight: { xs: 40, sm: 44, md: 48 },
                  fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                  "& .MuiTab-iconWrapper": {
                    marginRight: { xs: 0.3, sm: 0.5 },
                    marginBottom: "0 !important",
                  }
                }}
              />
            );
          })}
        </Tabs>
      </Box>

      <Box sx={{ flex: 1, pt: { xs: 7, sm: 8, md: 9 } }}>
        <Swiper
          modules={[Mousewheel, Keyboard]}
          spaceBetween={50}
          slidesPerView={1}
          initialSlide={tabIndex}
          onSwiper={setSwiperInstance}
          onSlideChange={handleSwipe}
          mousewheel={true}
          keyboard={{ enabled: true }}
          style={{ height: "100%" }}
        >
          {tabRoutes.map((route, idx) => {
            const Component = route.component;
            return (
              <SwiperSlide
                key={idx}
                style={{ height: "auto", overflowY: "auto" }}
              >
                <Box
                  sx={{
                    height: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)", md: "calc(100vh - 80px)" },
                    overflowY: "auto",
                    overflowX: "hidden",
                    py: { xs: 1, sm: 1.5, md: 2 },
                    px: { xs: 0.5, sm: 1 },
                    scrollbarGutter: "stable",
                    scrollbarWidth: "thin",
                    "&::-webkit-scrollbar": {
                      width: { xs: "2px", sm: "3px", md: "4px" },
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

export default TabsLayout;
