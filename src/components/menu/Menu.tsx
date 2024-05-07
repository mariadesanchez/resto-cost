import { titleFont } from '@/config/fonts';
export const Menu = () => {
    return (
        <div style={{ 
            fontSize: '36px', 
            lineHeight: '1.1', 
            margin: '0 auto', 
            maxWidth: '600px', 
            marginLeft: '350px', // Ajusta este valor según tu preferencia
            marginRight: 'auto' 
        }}>
            <h2 className={`${titleFont.className} antialiased font-bold text-white`} style={{  fontSize: '46px' }}>Menú</h2>
            <p className={`${titleFont.className} antialiased font-bold text-white`}  >
                <strong>Días 10 y 11 de Mayo</strong><br />
                <strong>Recepción</strong><br />
                Coctel de Bienvenida<br />
                <strong>Entrada</strong><br />
                Sopa de Cebolla<br />
                Ñoquis de Remolacha sobre Coulis de Pimiento<br />
                <strong>Plato Principal</strong><br />
                Lomo a la Wellington con Verduras de Estación<br />
                <strong>Postre</strong><br />
                Minitarta de Manzanas<br />
                Mousse de Chocolate<br />
                <strong>$ 18000, sólo efectivo.</strong> Incluye todos los platos.<br />
                <strong>Por régimenes especiales </strong>por favor solicite su necesidad <br />
                al momento de realizar la reserva.
            </p>
        </div>
        
        
    
    );
  }
  