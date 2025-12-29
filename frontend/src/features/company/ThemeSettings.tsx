import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setFullTheme, setCustomTheme } from '@/store/slices/themeSlice';
import { useTheme } from '@/hooks/useTheme';
import { getThemePresets, updateCompanyTheme, applyPresetTheme } from '@/services/themeService';
import { ThemePreset, ThemeConfig } from '@/types/theme';
import { useSnackbar } from 'notistack';

const ThemeSettings: React.FC = () => {
    const dispatch = useDispatch();
    const currentTheme = useTheme();
    const { enqueueSnackbar } = useSnackbar();

    const [presets, setPresets] = useState<ThemePreset[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');

    // Custom theme form state
    const [customThemeForm, setCustomThemeForm] = useState<ThemeConfig>({
        ...currentTheme
    });

    // Load presets on mount
    useEffect(() => {
        loadPresets();
    }, []);

    const loadPresets = async () => {
        try {
            const data = await getThemePresets();
            setPresets(data.response);
        } catch (error) {
            enqueueSnackbar('Failed to load theme presets', { variant: 'error' });
        }
    };

    const handleApplyPreset = async (presetName: string) => {
        setLoading(true);
        try {
            await applyPresetTheme(presetName);
            const selectedPreset = presets.find(p => p.name === presetName);
            if (selectedPreset) {
                dispatch(setFullTheme({
                    themeName: selectedPreset.name,
                    themeMode: selectedPreset.mode,
                    primaryColor: selectedPreset.primaryColor,
                    secondaryColor: selectedPreset.secondaryColor,
                    accentColor: selectedPreset.accentColor,
                    backgroundColor: selectedPreset.backgroundColor,
                    textColor: selectedPreset.textColor,
                    surfaceColor: selectedPreset.surfaceColor,
                    borderColor: selectedPreset.borderColor,
                    mutedColor: selectedPreset.mutedColor,
                    headingColor: selectedPreset.headingColor,
                    isCustom: false,
                }));
            }
            enqueueSnackbar(`Theme "${presetName}" applied successfully`, { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to apply theme', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleCustomThemeChange = (field: keyof ThemeConfig, value: string | boolean) => {
        setCustomThemeForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveCustomTheme = async () => {
        setLoading(true);
        try {
            await updateCompanyTheme({
                ...customThemeForm,
                isCustom: true
            });
            dispatch(setCustomTheme(customThemeForm));
            enqueueSnackbar('Custom theme saved successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to save custom theme', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-heading mb-2">Theme Settings</h1>
                <p className="text-muted mb-6">Customize your company's theme and branding</p>

                {/* Current Theme Display */}
                <div className="bg-surface rounded-lg p-6 mb-6 border border-borderColor">
                    <h2 className="text-xl font-semibold text-heading mb-4">Current Theme</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <p className="text-sm text-muted">Theme Name</p>
                            <p className="text-lg font-medium text-text">{currentTheme.themeName}</p>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-muted">Mode</p>
                            <p className="text-lg font-medium text-text capitalize">{currentTheme.themeMode}</p>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-muted">Type</p>
                            <p className="text-lg font-medium text-text">{currentTheme.isCustom ? 'Custom' : 'Preset'}</p>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <div className="flex-1">
                            <p className="text-xs text-muted mb-1">Primary</p>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded border border-borderColor" style={{ backgroundColor: currentTheme.primaryColor }}></div>
                                <span className="text-sm text-text">{currentTheme.primaryColor}</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-muted mb-1">Background</p>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded border border-borderColor" style={{ backgroundColor: currentTheme.backgroundColor }}></div>
                                <span className="text-sm text-text">{currentTheme.backgroundColor}</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-muted mb-1">Surface</p>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded border border-borderColor" style={{ backgroundColor: currentTheme.surfaceColor }}></div>
                                <span className="text-sm text-text">{currentTheme.surfaceColor}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-borderColor">
                    <button
                        onClick={() => setActiveTab('presets')}
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === 'presets'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-muted hover:text-text'
                            }`}
                    >
                        Preset Themes
                    </button>
                    <button
                        onClick={() => setActiveTab('custom')}
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === 'custom'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-muted hover:text-text'
                            }`}
                    >
                        Custom Theme
                    </button>
                </div>

                {/* Preset Themes Tab */}
                {activeTab === 'presets' && (
                    <div>
                        <h2 className="text-2xl font-semibold text-heading mb-4">Choose a Preset Theme</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {presets.map((preset) => (
                                <div
                                    key={preset.name}
                                    className="bg-surface rounded-lg p-4 border border-borderColor hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() => handleApplyPreset(preset.name)}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-semibold text-heading">{preset.name}</h3>
                                            <p className="text-sm text-muted capitalize">{preset.mode} mode</p>
                                        </div>
                                        {currentTheme.themeName === preset.name && !currentTheme.isCustom && (
                                            <span className="text-xs bg-primary text-white px-2 py-1 rounded">Active</span>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-5 gap-2">
                                        <div className="h-8 rounded" style={{ backgroundColor: preset.primaryColor }} title="Primary"></div>
                                        <div className="h-8 rounded" style={{ backgroundColor: preset.secondaryColor }} title="Secondary"></div>
                                        <div className="h-8 rounded" style={{ backgroundColor: preset.accentColor }} title="Accent"></div>
                                        <div className="h-8 rounded border border-borderColor" style={{ backgroundColor: preset.backgroundColor }} title="Background"></div>
                                        <div className="h-8 rounded border border-borderColor" style={{ backgroundColor: preset.surfaceColor }} title="Surface"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Custom Theme Tab */}
                {activeTab === 'custom' && (
                    <div>
                        <h2 className="text-2xl font-semibold text-heading mb-4">Create Custom Theme</h2>
                        <div className="bg-surface rounded-lg p-6 border border-borderColor">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Theme Name */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-text mb-2">Theme Name</label>
                                    <input
                                        type="text"
                                        value={customThemeForm.themeName}
                                        onChange={(e) => handleCustomThemeChange('themeName', e.target.value)}
                                        className="w-full px-4 py-2 border border-borderColor rounded-lg bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="My Custom Theme"
                                    />
                                </div>

                                {/* Theme Mode */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-text mb-2">Theme Mode</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="themeMode"
                                                value="light"
                                                checked={customThemeForm.themeMode === 'light'}
                                                onChange={(e) => handleCustomThemeChange('themeMode', e.target.value)}
                                                className="text-primary focus:ring-primary"
                                            />
                                            <span className="text-text">Light</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="themeMode"
                                                value="dark"
                                                checked={customThemeForm.themeMode === 'dark'}
                                                onChange={(e) => handleCustomThemeChange('themeMode', e.target.value)}
                                                className="text-primary focus:ring-primary"
                                            />
                                            <span className="text-text">Dark</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Color Pickers */}
                                {[
                                    { field: 'primaryColor', label: 'Primary Color' },
                                    { field: 'secondaryColor', label: 'Secondary Color' },
                                    { field: 'accentColor', label: 'Accent Color' },
                                    { field: 'backgroundColor', label: 'Background Color' },
                                    { field: 'surfaceColor', label: 'Surface Color' },
                                    { field: 'textColor', label: 'Text Color' },
                                    { field: 'headingColor', label: 'Heading Color' },
                                    { field: 'mutedColor', label: 'Muted Text Color' },
                                    { field: 'borderColor', label: 'Border Color' },
                                ].map(({ field, label }) => (
                                    <div key={field}>
                                        <label className="block text-sm font-medium text-text mb-2">{label}</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={customThemeForm[field as keyof ThemeConfig] as string}
                                                onChange={(e) => handleCustomThemeChange(field as keyof ThemeConfig, e.target.value)}
                                                className="w-16 h-10 rounded border border-borderColor cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={customThemeForm[field as keyof ThemeConfig] as string}
                                                onChange={(e) => handleCustomThemeChange(field as keyof ThemeConfig, e.target.value)}
                                                className="flex-1 px-4 py-2 border border-borderColor rounded-lg bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary"
                                                placeholder="#000000"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex gap-4">
                                <button
                                    onClick={handleSaveCustomTheme}
                                    disabled={loading}
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primaryHover transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save Custom Theme'}
                                </button>
                                <button
                                    onClick={() => setCustomThemeForm(currentTheme)}
                                    className="px-6 py-2 bg-surface text-text border border-borderColor rounded-lg hover:bg-accent transition-colors"
                                >
                                    Reset to Current
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ThemeSettings;
