import React, { useState, useEffect } from "react";

            export default function Predictions() {
              const [seasons, setSeasons] = useState([]);
              const [homeSeasonId, setHomeSeasonId] = useState("");
              const [awaySeasonId, setAwaySeasonId] = useState("");
              const [homeSeasonCode, setHomeSeasonCode] = useState("");
              const [awaySeasonCode, setAwaySeasonCode] = useState("");
              const [homeTeams, setHomeTeams] = useState([]);
              const [awayTeams, setAwayTeams] = useState([]);
              const [homeTeam, setHomeTeam] = useState("");
              const [awayTeam, setAwayTeam] = useState("");
              const [prediction, setPrediction] = useState(null);
              const [loading, setLoading] = useState(false);
              const [error, setError] = useState(null);

              const BACKEND_URL = process.env.REACT_APP_API_URL;

              // Fetch all seasons on mount
              useEffect(() => {
                async function fetchSeasons() {
                  try {
                    console.log('🔍 Fetching seasons from:', `${BACKEND_URL}/api/predictions/seasons`);

                    if (!BACKEND_URL) {
                      throw new Error('Backend URL not configured. Check REACT_APP_API_URL in .env');
                    }

                    const response = await fetch(`${BACKEND_URL}/api/predictions/seasons`);

                    console.log('📥 Seasons response status:', response.status);

                    if (!response.ok) {
                      throw new Error(`HTTP ${response.status}: Failed to fetch seasons`);
                    }

                    const data = await response.json();
                    console.log('✅ Seasons data:', data);

                    if (!data || data.length === 0) {
                      setError('No seasons found in database');
                      return;
                    }

                    setSeasons(data);
                    setError(null);
                  } catch (err) {
                    console.error('❌ Error fetching seasons:', err);
                    setError(`Failed to load seasons: ${err.message}`);
                  }
                }
                fetchSeasons();
              }, [BACKEND_URL]);

              // Fetch home teams when home season changes
              useEffect(() => {
                if (homeSeasonId) {
                  async function fetchHomeTeams() {
                    try {
                      console.log('🔍 Fetching home teams for season:', homeSeasonId);

                      const response = await fetch(
                        `${BACKEND_URL}/api/predictions/seasons/${homeSeasonId}/teams`
                      );

                      console.log('📥 Home teams response status:', response.status);

                      if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: Failed to fetch home teams`);
                      }

                      const data = await response.json();
                      console.log('✅ Home teams data:', data);

                      if (!data || data.length === 0) {
                        console.warn('⚠️ No teams found for home season');
                        setHomeTeams([]);
                        return;
                      }

                      setHomeTeams(data);
                      setHomeTeam("");
                    } catch (err) {
                      console.error('❌ Error fetching home teams:', err);
                      setError(`Failed to load home teams: ${err.message}`);
                      setHomeTeams([]);
                    }
                  }
                  fetchHomeTeams();
                }
              }, [homeSeasonId, BACKEND_URL]);

              // Fetch away teams when away season changes
              useEffect(() => {
                if (awaySeasonId) {
                  async function fetchAwayTeams() {
                    try {
                      console.log('🔍 Fetching away teams for season:', awaySeasonId);

                      const response = await fetch(
                        `${BACKEND_URL}/api/predictions/seasons/${awaySeasonId}/teams`
                      );

                      console.log('📥 Away teams response status:', response.status);

                      if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: Failed to fetch away teams`);
                      }

                      const data = await response.json();
                      console.log('✅ Away teams data:', data);

                      if (!data || data.length === 0) {
                        console.warn('⚠️ No teams found for away season');
                        setAwayTeams([]);
                        return;
                      }

                      setAwayTeams(data);
                      setAwayTeam("");
                    } catch (err) {
                      console.error('❌ Error fetching away teams:', err);
                      setError(`Failed to load away teams: ${err.message}`);
                      setAwayTeams([]);
                    }
                  }
                  fetchAwayTeams();
                }
              }, [awaySeasonId, BACKEND_URL]);

              const handlePredict = async () => {
                if (!homeTeam || !awayTeam || !homeSeasonCode || !awaySeasonCode) {
                  setError("Please select both teams and seasons");
                  return;
                }

                setLoading(true);
                setError(null);
                setPrediction(null);

                try {
                  console.log('🔍 Making prediction request:', {
                    homeTeam,
                    awayTeam,
                    homeSeasonCode,
                    awaySeasonCode,
                  });

                  const response = await fetch(`${BACKEND_URL}/api/predictions/predict`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      homeTeam,
                      awayTeam,
                      homeSeasonCode,
                      awaySeasonCode,
                    }),
                  });

                  console.log('📥 Prediction response status:', response.status);

                  const data = await response.json();
                  console.log('📊 Prediction data:', data);

                  if (response.ok) {
                    setPrediction(data);
                    setError(null);
                  } else {
                    setError(data.error || 'Prediction failed');
                  }
                } catch (err) {
                  console.error('❌ Error predicting match:', err);
                  setError(`Failed to get prediction: ${err.message}`);
                } finally {
                  setLoading(false);
                }
              };

              // Show connection error if backend URL is missing
              if (!BACKEND_URL) {
                return (
                  <div
                    style={{
                      padding: "2.5rem",
                      fontFamily: "'Inter', sans-serif",
                      minHeight: "100vh",
                      backgroundColor: "#0D1117",
                      color: "#E5E7EB",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      textAlign: "center",
                    }}
                  >
                    <h2 style={{ color: "#FF4D4D" }}>⚠️ Backend Not Configured</h2>
                    <p style={{ color: "#9CA3AF", maxWidth: "500px" }}>
                      Please ensure <code>REACT_APP_API_URL</code> is set in your <code>.env</code> file.
                    </p>
                  </div>
                );
              }

              return (
                <div
                  style={{
                    padding: "2.5rem",
                    fontFamily: "'Inter', sans-serif",
                    minHeight: "100vh",
                    backgroundColor: "#0D1117",
                    color: "#E5E7EB",
                    boxSizing: "border-box",
                  }}
                >
                  <div style={{ marginBottom: "2rem" }}>
                    <h1
                      style={{
                        fontSize: "2rem",
                        fontWeight: "700",
                        color: "#00FF87",
                        marginBottom: "0.3rem",
                      }}
                    >
                      Match Predictions
                    </h1>
                    <p style={{ color: "#9CA3AF", fontSize: "0.95rem" }}>
                      Compare teams across different seasons using ML predictions
                    </p>
                  </div>

                  {/* Global Error Message */}
                  {error && seasons.length === 0 && (
                    <div
                      style={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #FF4D4D",
                        borderRadius: "0.5rem",
                        padding: "1rem",
                        marginBottom: "2rem",
                        color: "#FF4D4D",
                        textAlign: "center",
                      }}
                    >
                      <strong>⚠️ Error:</strong> {error}
                      <p style={{ margin: "0.5rem 0 0", color: "#9CA3AF", fontSize: "0.9rem" }}>
                        Check that your backend is running and database is connected.
                      </p>
                    </div>
                  )}

                  {/* Selection Panel */}
                  <div
                    style={{
                      backgroundColor: "#111827",
                      borderRadius: "1rem",
                      padding: "2rem",
                      border: "1px solid #1F2937",
                      marginBottom: "2rem",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "2rem",
                      }}
                    >
                      {/* Home Team Selection */}
                      <div>
                        <h3 style={{ color: "#FFFFFF", marginBottom: "1rem" }}>Home Team</h3>

                        <label style={{ display: "block", color: "#9CA3AF", marginBottom: "0.5rem" }}>
                          Season:
                        </label>
                        <select
                          value={homeSeasonId}
                          onChange={(e) => {
                            const selectedSeason = seasons.find(s => s.id === parseInt(e.target.value));
                            setHomeSeasonId(e.target.value);
                            setHomeSeasonCode(selectedSeason?.code || "");
                          }}
                          disabled={seasons.length === 0}
                          style={{
                            width: "100%",
                            padding: "0.75rem",
                            backgroundColor: "#0F1623",
                            color: "#E5E7EB",
                            border: "1px solid #1F2937",
                            borderRadius: "0.5rem",
                            marginBottom: "1rem",
                            cursor: seasons.length > 0 ? "pointer" : "not-allowed",
                          }}
                        >
                          <option value="">
                            {seasons.length === 0 ? "Loading seasons..." : "Select Season"}
                          </option>
                          {seasons.map((season) => (
                            <option key={season.id} value={season.id}>
                              {season.code}
                            </option>
                          ))}
                        </select>

                        <label style={{ display: "block", color: "#9CA3AF", marginBottom: "0.5rem" }}>
                          Team:
                        </label>
                        <select
                          value={homeTeam}
                          onChange={(e) => setHomeTeam(e.target.value)}
                          disabled={!homeSeasonId || homeTeams.length === 0}
                          style={{
                            width: "100%",
                            padding: "0.75rem",
                            backgroundColor: "#0F1623",
                            color: "#E5E7EB",
                            border: "1px solid #1F2937",
                            borderRadius: "0.5rem",
                            cursor: homeSeasonId && homeTeams.length > 0 ? "pointer" : "not-allowed",
                          }}
                        >
                          <option value="">
                            {!homeSeasonId
                              ? "Select season first"
                              : homeTeams.length === 0
                              ? "No teams available"
                              : "Select Team"}
                          </option>
                          {homeTeams.map((team) => (
                            <option key={team.id} value={team.name}>
                              {team.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Away Team Selection */}
                      <div>
                        <h3 style={{ color: "#FFFFFF", marginBottom: "1rem" }}>Away Team</h3>

                        <label style={{ display: "block", color: "#9CA3AF", marginBottom: "0.5rem" }}>
                          Season:
                        </label>
                        <select
                          value={awaySeasonId}
                          onChange={(e) => {
                            const selectedSeason = seasons.find(s => s.id === parseInt(e.target.value));
                            setAwaySeasonId(e.target.value);
                            setAwaySeasonCode(selectedSeason?.code || "");
                          }}
                          disabled={seasons.length === 0}
                          style={{
                            width: "100%",
                            padding: "0.75rem",
                            backgroundColor: "#0F1623",
                            color: "#E5E7EB",
                            border: "1px solid #1F2937",
                            borderRadius: "0.5rem",
                            marginBottom: "1rem",
                            cursor: seasons.length > 0 ? "pointer" : "not-allowed",
                          }}
                        >
                          <option value="">
                            {seasons.length === 0 ? "Loading seasons..." : "Select Season"}
                          </option>
                          {seasons.map((season) => (
                            <option key={season.id} value={season.id}>
                              {season.code}
                            </option>
                          ))}
                        </select>

                        <label style={{ display: "block", color: "#9CA3AF", marginBottom: "0.5rem" }}>
                          Team:
                        </label>
                        <select
                          value={awayTeam}
                          onChange={(e) => setAwayTeam(e.target.value)}
                          disabled={!awaySeasonId || awayTeams.length === 0}
                          style={{
                            width: "100%",
                            padding: "0.75rem",
                            backgroundColor: "#0F1623",
                            color: "#E5E7EB",
                            border: "1px solid #1F2937",
                            borderRadius: "0.5rem",
                            cursor: awaySeasonId && awayTeams.length > 0 ? "pointer" : "not-allowed",
                          }}
                        >
                          <option value="">
                            {!awaySeasonId
                              ? "Select season first"
                              : awayTeams.length === 0
                              ? "No teams available"
                              : "Select Team"}
                          </option>
                          {awayTeams.map((team) => (
                            <option key={team.id} value={team.name}>
                              {team.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={handlePredict}
                      disabled={loading || !homeTeam || !awayTeam}
                      style={{
                        marginTop: "1.5rem",
                        width: "100%",
                        padding: "0.75rem",
                        backgroundColor: loading || !homeTeam || !awayTeam ? "#374151" : "#00FF87",
                        color: "#0D1117",
                        border: "none",
                        borderRadius: "0.5rem",
                        fontWeight: "600",
                        fontSize: "1rem",
                        cursor: loading || !homeTeam || !awayTeam ? "not-allowed" : "pointer",
                        transition: "background-color 0.3s",
                      }}
                      onMouseEnter={(e) => {
                        if (!loading && homeTeam && awayTeam) {
                          e.target.style.backgroundColor = "#00cc6f";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!loading && homeTeam && awayTeam) {
                          e.target.style.backgroundColor = "#00FF87";
                        }
                      }}
                    >
                      {loading ? "Predicting..." : "Predict Match"}
                    </button>

                    {error && seasons.length > 0 && (
                      <p style={{ color: "#FF4D4D", marginTop: "1rem", textAlign: "center" }}>
                        {error}
                      </p>
                    )}
                  </div>

                  {/* Prediction Results */}
                  {prediction && (
                    <div
                      style={{
                        backgroundColor: "#111827",
                        borderRadius: "1rem",
                        padding: "2rem",
                        border: "1px solid #1F2937",
                      }}
                    >
                      <h2 style={{ color: "#FFFFFF", fontSize: "1.5rem", marginBottom: "1rem" }}>
                        Prediction Results
                      </h2>

                      <h3 style={{ color: "#E5E7EB", marginBottom: "1.5rem", textAlign: "center" }}>
                        {prediction.home_team} ({prediction.home_season}) vs{" "}
                        {prediction.away_team} ({prediction.away_season})
                      </h3>

                      {[
                        {
                          label: `${prediction.home_team} Win`,
                          color: "#22c55e",
                          value: (prediction.probabilities.home_win * 100).toFixed(1),
                        },
                        {
                          label: "Draw",
                          color: "#eab308",
                          value: (prediction.probabilities.draw * 100).toFixed(1),
                        },
                        {
                          label: `${prediction.away_team} Win`,
                          color: "#ef4444",
                          value: (prediction.probabilities.away_win * 100).toFixed(1),
                        },
                      ].map((bar, i) => (
                        <div key={i} style={{ marginBottom: "1.5rem" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: "1rem",
                              marginBottom: "0.5rem",
                              color: "#E5E7EB",
                            }}
                          >
                            <span>{bar.label}</span>
                            <span style={{ color: bar.color, fontWeight: "600" }}>
                              {bar.value}%
                            </span>
                          </div>
                          <div
                            style={{
                              backgroundColor: "#1E2635",
                              borderRadius: "1rem",
                              height: "16px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${bar.value}%`,
                                height: "100%",
                                backgroundColor: bar.color,
                                borderRadius: "1rem",
                                transition: "width 0.5s ease",
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}

                      <div
                        style={{
                          marginTop: "2rem",
                          padding: "1rem",
                          backgroundColor: "#0F1623",
                          borderRadius: "0.75rem",
                          textAlign: "center",
                        }}
                      >
                        <p style={{ color: "#9CA3AF", margin: 0 }}>Predicted Outcome:</p>
                        <p
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: "700",
                            color: "#00FF87",
                            margin: "0.5rem 0 0 0",
                            textTransform: "uppercase",
                          }}
                        >
                          {prediction.prediction.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            }