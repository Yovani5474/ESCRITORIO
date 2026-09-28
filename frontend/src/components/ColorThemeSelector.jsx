import React, { useState, useEffect } from 'react';

const ColorThemeSelector = ({ campeonato, onThemeChange }) => {
  const [localTheme, setLocalTheme] = useState({
    color_primario: '#3498db',
    color_secundario: '#2c3e50',
    color_acento: '#e74c3c',
    color_fondo: '#f5f5f5',
    color_texto: '#333333',
    modo_oscuro: false
  });

  useEffect(() => {
    if (campeonato) {
      setLocalTheme({
        color_primario: campeonato.color_tema || '#3498db',
        color_secundario: campeonato.color_secundario || '#2c3e50',
        color_acento: campeonato.color_acento || '#e74c3c',
        color_fondo: campeonato.color_fondo || '#f5f5f5',
        color_texto: campeonato.color_texto || '#333333',
        modo_oscuro: campeonato.modo_oscuro || false
      });
    }
  }, [campeonato]);

  const handleColorChange = (campo, valor) => {
    const nuevoTheme = { ...localTheme, [campo]: valor };
    setLocalTheme(nuevoTheme);
    if (onThemeChange) onThemeChange(nuevoTheme);
  };

  const aplicarTema = () => {
    // Aplicar colores al documento
    document.documentElement.style.setProperty('--color-primario', localTheme.color_primario);
    document.documentElement.style.setProperty('--color-secundario', localTheme.color_secundario);
    document.documentElement.style.setProperty('--color-acento', localTheme.color_acento);
    document.documentElement.style.setProperty('--color-fondo', localTheme.color_fondo);
    document.documentElement.style.setProperty('--color-texto', localTheme.color_texto);

    if (localTheme.modo_oscuro) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const presets = [
    {
      nombre: 'Azul Profesional',
      colores: { color_primario: '#3498db', color_secundario: '#2c3e50', color_acento: '#e74c3c', color_fondo: '#f5f5f5' }
    },
    {
      nombre: 'Verde Deportivo',
      colores: { color_primario: '#27ae60', color_secundario: '#1e8449', color_acento: '#f39c12', color_fondo: '#f0f9f4' }
    },
    {
      nombre: 'Rojo Intenso',
      colores: { color_primario: '#e74c3c', color_secundario: '#c0392b', color_acento: '#f1c40f', color_fondo: '#fdf2f2' }
    },
    {
      nombre: 'Púreo Real',
      colores: { color_primario: '#9b59b6', color_secundario: '#8e44ad', color_acento: '#3498db', color_fondo: '#f5f0f9' }
    }
  ];

  return (
    <div className="color-theme-selector">
      <h3 className="theme-title">Personalización de Colores</h3>

      <div className="theme-presets">
        <span className="presets-label">Presets:</span>
        {presets.map(preset => (
          <button
            key={preset.nombre}
            className="preset-btn"
            onClick={() => {
              Object.entries(preset.colores).forEach(([campo, valor]) => {
                handleColorChange(campo, valor);
              });
            }}
          >
            {preset.nombre}
          </button>
        ))}
      </div>

      <div className="color-inputs">
        <div className="color-input-group">
          <label>Color Primario</label>
          <input
            type="color"
            value={localTheme.color_primario}
            onChange={(e) => handleColorChange('color_primario', e.target.value)}
          />
        </div>

        <div className="color-input-group">
          <label>Color Secundario</label>
          <input
            type="color"
            value={localTheme.color_secundario}
            onChange={(e) => handleColorChange('color_secundario', e.target.value)}
          />
        </div>

        <div className="color-input-group">
          <label>Color de Acento</label>
          <input
            type="color"
            value={localTheme.color_acento}
            onChange={(e) => handleColorChange('color_acento', e.target.value)}
          />
        </div>

        <div className="color-input-group">
          <label>Color de Fondo</label>
          <input
            type="color"
            value={localTheme.color_fondo}
            onChange={(e) => handleColorChange('color_fondo', e.target.value)}
          />
        </div>

        <div className="color-input-group">
          <label>Color de Texto</label>
          <input
            type="color"
            value={localTheme.color_texto}
            onChange={(e) => handleColorChange('color_texto', e.target.value)}
          />
        </div>
      </div>

      <div className="theme-toggle">
        <label>
          <input
            type="checkbox"
            checked={localTheme.modo_oscuro}
            onChange={(e) => handleColorChange('modo_oscuro', e.target.checked)}
          />
          Modo Oscuro
        </label>
      </div>

      <button className="btn-apply-theme" onClick={aplicarTema}>
        Aplicar Tema
      </button>
    </div>
  );
};

export default ColorThemeSelector;
