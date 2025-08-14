import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface GameState {
  isConnected: boolean;
  userAddress?: string;
  player?: any;
  alliance?: any;
  territories: any[];
  battles: any[];
  messages: any[];
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    isConnected: false,
    territories: [],
    battles: [],
    messages: [],
  });

  const queryClient = useQueryClient();

  // WebSocket connection for real-time updates
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'new_message') {
        queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      }
      
      if (data.type === 'battle_update') {
        queryClient.invalidateQueries({ queryKey: ['/api/battles'] });
      }
      
      if (data.type === 'territory_update') {
        queryClient.invalidateQueries({ queryKey: ['/api/territories'] });
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, [queryClient]);

  // Player data query
  const { data: player } = useQuery({
    queryKey: ['/api/users', gameState.userAddress],
    enabled: !!gameState.userAddress,
  });

  // Alliance data query
  const { data: alliance } = useQuery({
    queryKey: ['/api/users', player?.id, 'alliance'],
    enabled: !!player?.id,
  });

  // Territories query
  const { data: territories = [] } = useQuery({
    queryKey: ['/api/territories'],
  });

  // Battles query
  const { data: battles = [] } = useQuery({
    queryKey: ['/api/battles/user', player?.id],
    enabled: !!player?.id,
  });

  // Messages query
  const { data: messages = [] } = useQuery({
    queryKey: ['/api/messages/global'],
  });

  // Leaderboard query
  const { data: leaderboard = [] } = useQuery({
    queryKey: ['/api/leaderboard'],
  });

  return {
    gameState: {
      ...gameState,
      player,
      alliance,
      territories,
      battles,
      messages,
      leaderboard,
    },
    setGameState,
  };
}
