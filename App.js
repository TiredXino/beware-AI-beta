import React, { useState } from 'react';
import './App.css';

const Configurator = () => {
    const [ping, setPing] = useState(50);
    const [isLoading, setIsLoading] = useState(false);
    const [config, setConfig] = useState({
        Settings: { Version: "1.0.1" },
        Enabled: true,
        Prediction: 0.133333,
        TargetPart: "HumanoidRootPart",
        NearestPoint: true,
        WallCheck: true,
        FOV: { Radius: 50, Visible: false },
        CamLock: {
            Enabled: true,
            Smoothness: 0.133333,
            Prediction: 0,
            RoboticMode: false,
            Key: "C"
        },
        Checks: {
            WallCheck: true,
            FOVCheck: true,
            KnockCheck: true,
            TeamCheck: false,
            FriendCheck: false
        },
        NoSpread: { Enabled: true },
        HeadlessNKorblox: { Enabled: true }
    });

    const handleChange = (section, key, value, nestedSection = null) => {
        setConfig(prev => {
            const newConfig = { ...prev };
            if (nestedSection) {
                newConfig[section][nestedSection][key] = value;
            } else if (section) {
                newConfig[section][key] = value;
            } else {
                newConfig[key] = value;
            }
            return newConfig;
        });
    };

    const generateRandomConfig = () => {
        setIsLoading(true);
        setTimeout(() => {
            const pingFactor = ping / 1000;
            const basePrediction = Math.min(0.1 + pingFactor * 0.5, 0.3);
            const baseSmoothness = Math.max(0.05, 0.15 - pingFactor * 0.1);

            const newConfig = {
                Settings: { Version: "1.0.1" },
                Enabled: Math.random() > 0.2,
                Prediction: parseFloat((basePrediction + (Math.random() - 0.5) * 0.05).toFixed(6)),
                TargetPart: ["Head", "HumanoidRootPart", "UpperTorso"][Math.floor(Math.random() * 3)],
                NearestPoint: Math.random() > 0.3,
                WallCheck: Math.random() > 0.3,
                FOV: {
                    Radius: Math.floor(30 + Math.random() * 70),
                    Visible: Math.random() > 0.5
                },
                CamLock: {
                    Enabled: Math.random() > 0.2,
                    Smoothness: parseFloat((baseSmoothness + (Math.random() - 0.5) * 0.05).toFixed(6)),
                    Prediction: parseFloat((basePrediction * 0.5 + (Math.random() - 0.5) * 0.03).toFixed(6)),
                    RoboticMode: Math.random() > 0.7,
                    Key: ["C", "E", "Q", "T"][Math.floor(Math.random() * 4)]
                },
                Checks: {
                    WallCheck: Math.random() > 0.3,
                    FOVCheck: Math.random() > 0.3,
                    KnockCheck: Math.random() > 0.2,
                    TeamCheck: Math.random() > 0.6,
                    FriendCheck: Math.random() > 0.7
                },
                NoSpread: { Enabled: Math.random() > 0.2 },
                HeadlessNKorblox: { Enabled: Math.random() > 0.4 }
            };

            setConfig(newConfig);
            setIsLoading(false);
        }, 300);
    };

    const generateConfigString = () => {
        return `getgenv().beware = ${JSON.stringify(config, (key, value) => {
            if (key === "Key") return `Enum.KeyCode.${value}`;
            return value;
        }, 4).replace(/"Enum.KeyCode.([^"]+)"/g, "Enum.KeyCode.$1")}`;
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generateConfigString())
            .then(() => alert("Configuration copied to clipboard!"))
            .catch(() => alert("Failed to copy configuration."));
    };

    return (
        <div className="container">
            <h1 className="title">Beware Script Configurator</h1>
            <p className="subtitle">Made by Jaydes | @8jds</p>

            {/* Ping Input */}
            <div className="card">
                <h2 className="section-title pink">Ping Configuration</h2>
                <div className="input-group">
                    <label className="label">Your Ping (ms)</label>
                    <input
                        type="number"
                        min="0"
                        value={ping}
                        onChange={(e) => setPing(Math.max(0, parseInt(e.target.value) || 0))}
                        className="input"
                        disabled={isLoading}
                    />
                    <button
                        onClick={generateRandomConfig}
                        disabled={isLoading}
                        className={`button green ${isLoading ? 'disabled' : ''}`}
                    >
                        {isLoading ? 'Generating...' : 'Generate Random Config'}
                    </button>
                </div>
            </div>

            {/* Main Settings */}
            <div className="card">
                <h2 className="section-title cyan">General Settings</h2>
                <div className="grid">
                    <div>
                        <label className="label">Enabled</label>
                        <input
                            type="checkbox"
                            checked={config.Enabled}
                            onChange={(e) => handleChange(null, "Enabled", e.target.checked)}
                            className="checkbox"
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="label">Prediction</label>
                        <input
                            type="number"
                            step="0.01"
                            value={config.Prediction}
                            onChange={(e) => handleChange(null, "Prediction", parseFloat(e.target.value))}
                            className="input"
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="label">Target Part</label>
                        <select
                            value={config.TargetPart}
                            onChange={(e) => handleChange(null, "TargetPart", e.target.value)}
                            className="input"
                            disabled={isLoading}
                        >
                            {["Head", "HumanoidRootPart", "UpperTorso"].map(part => (
                                <option key={part} value={part}>{part}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="label">Nearest Point</label>
                        <input
                            type="checkbox"
                            checked={config.NearestPoint}
                            onChange={(e) => handleChange(null, "NearestPoint", e.target.checked)}
                            className="checkbox"
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="label">Wall Check</label>
                        <input
                            type="checkbox"
                            checked={config.WallCheck}
                            onChange={(e) => handleChange(null, "WallCheck", e.target.checked)}
                            className="checkbox"
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </div>

            {/* FOV Settings */}
            <div className="card">
                <h2 className="section-title yellow">FOV Settings</h2>
                <div className="grid">
                    <div>
                        <label className="label">Radius</label>
                        <input
                            type="number"
                            value={config.FOV.Radius}
                            onChange={(e) => handleChange("FOV", "Radius", parseInt(e.target.value))}
                            className="input"
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="label">Visible</label>
                        <input
                            type="checkbox"
                            checked={config.FOV.Visible}
                            onChange={(e) => handleChange("FOV", "Visible", e.target.checked)}
                            className="checkbox"
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </div>

            {/* CamLock Settings */}
            <div className="card">
                <h2 className="section-title green">CamLock Settings</h2>
                <div className="grid">
                    <div>
                        <label className="label">Enabled</label>
                        <input
                            type="checkbox"
                            checked={config.CamLock.Enabled}
                            onChange={(e) => handleChange("CamLock", "Enabled", e.target.checked)}
                            className="checkbox"
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="label">Smoothness</label>
                        <input
                            type="number"
                            step="0.01"
                            value={config.CamLock.Smoothness}
                            onChange={(e) => handleChange("CamLock", "Smoothness", parseFloat(e.target.value))}
                            className="input"
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="label">Prediction</label>
                        <input
                            type="number"
                            step="0.01"
                            value={config.CamLock.Prediction}
                            onChange={(e) => handleChange("CamLock", "Prediction", parseFloat(e.target.value))}
                            className="input"
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="label">Robotic Mode</label>
                        <input
                            type="checkbox"
                            checked={config.CamLock.RoboticMode}
                            onChange={(e) => handleChange("CamLock", "RoboticMode", e.target.checked)}
                            className="checkbox"
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="label">Key</label>
                        <select
                            value={config.CamLock.Key}
                            onChange={(e) => handleChange("CamLock", "Key", e.target.value)}
                            className="input"
                            disabled={isLoading}
                        >
                            {["C", "E", "Q", "T"].map(key => (
                                <option key={key} value={key}>{key}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Checks Settings */}
            <div className="card">
                <h2 className="section-title purple">Checks Settings</h2>
                <div className="grid">
                    {Object.entries(config.Checks).map(([key, value]) => (
                        <div key={key}>
                            <label className="label">{key}</label>
                            <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => handleChange("Checks", key, e.target.checked)}
                                className="checkbox"
                                disabled={isLoading}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* NoSpread and HeadlessNKorblox */}
            <div className="card">
                <h2 className="section-title orange">Additional Features</h2>
                <div className="grid">
                    <div>
                        <label className="label">NoSpread Enabled</label>
                        <input
                            type="checkbox"
                            checked={config.NoSpread.Enabled}
                            onChange={(e) => handleChange("NoSpread", "Enabled", e.target.checked)}
                            className="checkbox"
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="label">HeadlessNKorblox Enabled</label>
                        <input
                            type="checkbox"
                            checked={config.HeadlessNKorblox.Enabled}
                            onChange={(e) => handleChange("HeadlessNKorblox", "Enabled", e.target.checked)}
                            className="checkbox"
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </div>

            {/* Generated Configuration */}
            <div className="card">
                <h2 className="section-title teal">Generated Configuration</h2>
                <pre className="code-block">{generateConfigString()}</pre>
                <button
                    onClick={copyToClipboard}
                    disabled={isLoading}
                    className={`button blue ${isLoading ? 'disabled' : ''}`}
                >
                    Copy to Clipboard
                </button>
            </div>
        </div>
    );
};

export default Configurator;