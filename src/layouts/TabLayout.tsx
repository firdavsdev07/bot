import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Keyboard } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/swiper-bundle.css";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { tabRoutes } from "./tabRoutes";

const TabsLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

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
          bgcolor: "#E5E7EB",
          zIndex: 1000,
          px: 2,
          pt: 1,
          pb: 1,
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mt: 1 }}
        >
          {tabRoutes.map((tab, idx) => (
            <Tab
              key={idx}
              label={<Typography fontWeight={600}>{tab.label}</Typography>}
            />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ flex: 1, pt: 8 }}>
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
                    height: "calc(100vh - 80px)",
                    overflowY: "auto",
                    py: 2,
                    pl: 1,
                    scrollbarGutter: "stable",
                    scrollbarWidth: "thin",
                    "&::-webkit-scrollbar": {
                      width: "1px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#888",
                      borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "#f1f1f1",
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
