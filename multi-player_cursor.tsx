import { routePartykitRequest, Server } from "partyserver";
  
import type { OutgoingMessage, Position } from "../shared";
import type { Connection, ConnectionContext } from "partyserver";

// This is the state that we'll store on each connection
type ConnectionState = {
  position: Position;
};

export class Globe extends Server {
  onConnect(conn: Connection<ConnectionState>, ctx: ConnectionContext) {
    // Whenever a fresh connection is made, we'll
    // send the entire state to the new connection
    
    // First, let's set up the connection state
    conn.setState({ position: { x: 0, y: 0 } });
    
    // Send current state to new connection
    this.broadcast(JSON.stringify({
      type: "user-joined",
      id: conn.id,
      position: conn.state.position
    }));
  }

  onMessage(message: string, sender: Connection<ConnectionState>) {
    const data = JSON.parse(message) as OutgoingMessage;
    
    if (data.type === "position-update") {
      sender.setState({ position: data.position });
      
      // Broadcast position update to all other connections
      this.broadcast(JSON.stringify({
        type: "position-update",
        id: sender.id,
        position: data.position
      }), [sender.id]);
    }
  }

  onClose(connection: Connection<ConnectionState>) {
    this.broadcast(JSON.stringify({
      type: "user-left",
      id: connection.id
    }));
  }
}
