import React from 'react';
import {
  GoogleMap, 
  DrawingManagerF, 
  CircleF, 
  MarkerF,
  PolylineF,
  RectangleF,
  PolygonF,
  useJsApiLoader 
} from '@react-google-maps/api';

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

const libraries = ['drawing'];

function Map() {
  const [points, setPoints] = React.useState(() => {
    const storagedPoints = localStorage.getItem('points');

    if (storagedPoints) {
      return JSON.parse(storagedPoints);
    }

    return {};
  });

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  });
  
  function handleMarkerComplete(marker) {
    const newMarker = marker.getPosition();
    
    const markers = 'markers' in points
      ? [...points.markers, newMarker]
      : [newMarker];
    
    const updatedPoints = {
      ...points,
      markers
    };
    
    setPoints(updatedPoints);

    localStorage.setItem('points', JSON.stringify(updatedPoints));
  }

  function handlePolylineComplete(polyline) {
    const newPolyline = polyline.getPath().Qd;
    
    const polylines = 'polylines' in points
      ? [...points.polylines, newPolyline]
      : [newPolyline];
    
    const updatedPoints = {
      ...points,
      polylines
    };
    
    setPoints(updatedPoints);

    localStorage.setItem('points', JSON.stringify(updatedPoints));
  }

  function handleRectangleComplete(rectangle) {
    const newRectangle = rectangle.getBounds();
    
    const rectangles = 'rectangles' in points
      ? [...points.rectangles, newRectangle]
      : [newRectangle];
    
    const updatedPoints = {
      ...points,
      rectangles
    };
    
    setPoints(updatedPoints);

    localStorage.setItem('points', JSON.stringify(updatedPoints));
  }

  function handleCircleComplete(circle) {
    const newCircle = {
      center: circle.getCenter(),
      radius: circle.getRadius()
    };
    
    const circles = 'circles' in points
      ? [...points.circles, newCircle]
      : [newCircle];
    
    const updatedPoints = {
      ...points,
      circles
    };
    
    setPoints(updatedPoints);

    localStorage.setItem('points', JSON.stringify(updatedPoints));
  }

  function handlePolygonComplete(polygon) {
    const newPolygon = polygon.getPaths().Qd.map(data => data.Qd).reduce((_, cur) => cur, {})

    const polygons = 'polygons' in points
      ? [...points.polygons, newPolygon]
      : [newPolygon];
    
    const updatedPoints = {
      ...points,
      polygons
    };
    
    setPoints(updatedPoints);

    localStorage.setItem('points', JSON.stringify(updatedPoints));
  }

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  return isLoaded
    ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
        >
          <DrawingManagerF
            onMarkerComplete={handleMarkerComplete}
            onPolylineComplete={handlePolylineComplete}
            onRectangleComplete={handleRectangleComplete}
            onCircleComplete={handleCircleComplete}
            onPolygonComplete={handlePolygonComplete}
          />
          {points?.markers?.map((position, index) => <MarkerF key={index} position={position} />)}
          {points?.polylines?.map((path, index) => <PolylineF key={index} path={path} />)}
          {points?.rectangles?.map((bounds, index) => <RectangleF key={index} bounds={bounds} />)}
          {points?.circles?.map((circle, index) => <CircleF key={index} center={circle.center} radius={circle.radius} />)}
          {points?.polygons?.map((path, index) => <PolygonF key={index} path={path} />)}
        </GoogleMap>
      )
    : <div>Loading map...</div>;
}

export default React.memo(Map);
