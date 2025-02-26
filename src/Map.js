import { h, render, useSignal, htm, useEffect, useRef, useState, useReducer, Component  } from "../lib/standalone.js";
import L from '../lib/leaflet.js';


const html = htm.bind(h);

export default class Map extends Component {
    constructor(props) {
      super(props);
      this.mapRef = null;
      this.map = null;
    }
  
    componentDidMount() {
      // Initialize the map after DOM is ready
      this.initializeMap();
    }
  
    componentDidUpdate(prevProps) {
      // Update map position if props change
      if (prevProps.lat !== this.props.lat || 
          prevProps.lng !== this.props.lng) {
        this.map.setView([this.props.lat, this.props.lng], this.props.zoom);
      }
    }
  
    componentWillUnmount() {
      // Clean up map instance
      if (this.map) {
        this.map.remove();
      }
    }
  
    initializeMap() {
      const { lat = 40, lng = -92, zoom = 3, msg = "you are here" } = this.props;
  
      // Create map instance
      this.map = L.map(this.mapRef).setView([lat, lng], zoom);
  
      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(this.map);
  
      // Optional: Add a marker
      L.marker([lat, lng]).addTo(this.map)
        .bindPopup(msg)
        .openPopup();
    }
  
    render() {
      return html`
        <div class="map-container">
          <div 
            ref=${el => this.mapRef = el}
            style="height: 400px; width: 100%"
          ></div>
        </div>
      `;
    }
  }