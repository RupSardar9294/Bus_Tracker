let trackingActive = false;
        let trackingInterval = null;

        function showInterface(interfaceName) {
            // Hide all interfaces
            document.querySelectorAll('.interface').forEach(el => {
                el.classList.remove('active');
            });
            
            // Remove active class from all buttons
            document.querySelectorAll('.interface-btn').forEach(el => {
                el.classList.remove('active');
            });
            
            // Show selected interface
            document.getElementById(interfaceName).classList.add('active');
            event.target.classList.add('active');
        }

        function driverLogin() {
            const driverId = document.getElementById('driverId').value;
            const pin = document.getElementById('driverPin').value;
            
            if (driverId && pin) {
                document.getElementById('driver-login').classList.add('hidden');
                document.getElementById('driver-dashboard').classList.remove('hidden');
                
                // Show welcome notification
                const notification = document.createElement('div');
                notification.className = 'notification';
                notification.innerHTML = `<strong>✅ Welcome, Driver ${driverId}!</strong><br>Please select your route and start tracking.`;
                document.getElementById('driver-dashboard').insertBefore(notification, document.getElementById('driver-dashboard').firstChild);
                
                setTimeout(() => notification.remove(), 5000);
            } else {
                alert('Please enter both Driver ID and PIN');
            }
        }

        function driverLogout() {
            if (trackingActive) {
                toggleTracking();
            }
            document.getElementById('driver-login').classList.remove('hidden');
            document.getElementById('driver-dashboard').classList.add('hidden');
            document.getElementById('driverId').value = '';
            document.getElementById('driverPin').value = '';
        }

        function toggleTracking() {
            const routeSelect = document.getElementById('routeSelect');
            const trackingBtn = document.getElementById('tracking-btn');
            const statusCard = document.getElementById('tracking-status');
            const statusText = document.getElementById('tracking-status-text');
            const currentLocation = document.getElementById('current-location');
            const startTime = document.getElementById('start-time');
            
            if (!trackingActive) {
                if (!routeSelect.value) {
                    alert('Please select a route first!');
                    return;
                }
                
                // Request location permission
                if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        // Start tracking
                        trackingActive = true;
                        trackingBtn.textContent = '🛑 STOP TRACKING';
                        trackingBtn.className = 'btn btn-danger';
                        statusCard.classList.add('status-active');
                        statusText.textContent = '🟢 TRACKING ACTIVE';
                        currentLocation.textContent = 'Main Street Bus Stop';
                        startTime.textContent = new Date().toLocaleTimeString();
                        
                        // Simulate location updates
                        const locations = ['Main Street', 'City Mall', 'Bank Street', 'Downtown Terminal'];
                        let locationIndex = 0;
                        
                        trackingInterval = setInterval(() => {
                            locationIndex = (locationIndex + 1) % locations.length;
                            currentLocation.textContent = locations[locationIndex] + ' Bus Stop';
                            
                            // Update battery level
                            const currentBattery = parseInt(document.getElementById('battery-level').textContent);
                            document.getElementById('battery-level').textContent = Math.max(currentBattery - 1, 60) + '%';
                        }, 5000);
                        
                    }, function(error) {
                        alert('Location access is required for GPS tracking. Please enable location services.');
                    });
                } else {
                    alert('Geolocation is not supported by this browser.');
                }
            } else {
                // Stop tracking
                trackingActive = false;
                trackingBtn.textContent = '🚀 START TRACKING';
                trackingBtn.className = 'btn btn-success';
                statusCard.classList.remove('status-active');
                statusText.textContent = 'Stopped';
                
                if (trackingInterval) {
                    clearInterval(trackingInterval);
                }
            }
        }

        function showRouteDetails(routeId) {
            document.querySelector('.route-grid').style.display = 'none';
            document.querySelector('.search-box').style.display = 'none';
            document.getElementById('route-details').classList.remove('hidden');
            
            // Update route title based on selection
            const routeTitles = {
                12: 'Route 12: Central Station ↔ Downtown',
                15: 'Route 15: Airport ↔ City Mall', 
                8: 'Route 8: Hospital ↔ Railway Station'
            };
            document.getElementById('route-title').textContent = routeTitles[routeId];
            
            // Simulate live updates
            setTimeout(() => {
                const busCards = document.querySelectorAll('#route-details .bus-card');
                if (busCards.length > 0) {
                    const timeSpan = busCards[0].querySelector('.status-item span:last-child');
                    if (timeSpan) {
                        const currentTime = parseInt(timeSpan.textContent);
                        if (currentTime > 1) {
                            timeSpan.textContent = (currentTime - 1) + ' minutes';
                        }
                    }
                }
            }, 3000);
        }

        function hideRouteDetails() {
            document.querySelector('.route-grid').style.display = 'grid';
            document.querySelector('.search-box').style.display = 'block';
            document.getElementById('route-details').classList.add('hidden');
        }

        function searchRoutes(query) {
            const routeCards = document.querySelectorAll('.route-card');
            routeCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(query.toLowerCase()) || query === '') {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        function findNearby() {
            alert('📍 Finding nearby buses...\n\nBuses near your location:\n• Route 12: 150m away (3 min)\n• Route 8: 300m away (7 min)');
        }

        // Simulate real-time updates for admin dashboard
        setInterval(() => {
            const userCount = document.querySelector('.stat-card .stat-number');
            if (userCount && userCount.textContent !== '15') {
                const current = parseInt(userCount.textContent);
                userCount.textContent = current + Math.floor(Math.random() * 5);
            }
        }, 10000);

        // Auto-refresh simulation for live data
        setInterval(() => {
            if (document.getElementById('commuter').classList.contains('active')) {
                // Update arrival times
                const timeElements = document.querySelectorAll('.bus-card .status-item span:last-child');
                timeElements.forEach(el => {
                    if (el.textContent.includes('min')) {
                        const currentTime = parseInt(el.textContent);
                        if (currentTime > 1) {
                            el.textContent = (currentTime - 1) + ' minutes';
                            if (currentTime - 1 <= 2) {
                                el.parentElement.parentElement.classList.add('arriving');
                            }
                        }
                    }
                });
            }
        }, 30000);