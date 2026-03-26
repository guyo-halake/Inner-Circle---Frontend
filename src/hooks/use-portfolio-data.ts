import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "@/lib/api";

export function usePortfolioData() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // Return a default zeroed state instead of an error
          setData({
            totalInvestment: 0,
            currentValue: 0,
            netProfit: 0,
            todayChange: 0,
            todayChangePercent: 0,
            lastUpdate: new Date().toISOString()
          });
          return;
        }

        const response = await fetch(`${API_URL}/api/portfolio`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch portfolio data');
        }

        const portfolioData = await response.json();
        setData(portfolioData);

        const decodedToken: any = jwtDecode(token);
        if (decodedToken) {
          const socket = io(API_URL);
          socket.emit('join', decodedToken.id);
          socket.on('portfolioUpdate', (updatedPortfolio) => {
            setData(updatedPortfolio);
          });

          return () => {
            socket.disconnect();
          };
        }
      } catch (err: any) {
        setError(err.message);
        // Fallback to zeros on network error to keep Dashboard viewable
        setData({
          totalInvestment: 0,
          currentValue: 0,
          netProfit: 0,
          todayChange: 0,
          todayChangePercent: 0,
          lastUpdate: new Date().toISOString()
        });
      }
    };

    fetchData();
  }, []);

  return { data, error };
}
