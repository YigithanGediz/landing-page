import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# Parameters
N = 512  # Number of grid points
x_max = 20  # Spatial domain extent
dx = 2 * x_max / N  # Spatial step
x = np.linspace(-x_max, x_max, N, endpoint=False)  # Grid points
dt = 0.01  # Time step
t_max = 20.0  # Maximum time
#t_max = 5
num_steps = int(t_max / dt)  # Number of steps
hbar = 1.0  # Reduced Planck's constant
m = 1.0  # Particle mass
omega = 1.0

# Momentum space grid
k = 2 * np.pi * np.fft.fftfreq(N, d=dx)

# Initial Gaussian wave packet
x0 = -5.0  # Initial position
p0 = 10.0  # Initial momentum
sigma = 1.5  # Initial width of the wave packet
psi = (1 / (sigma * np.sqrt(np.pi)) ** 0.5) * np.exp(-((x - x0) ** 2) / (2 * sigma ** 2)) * np.exp(1j * p0 * x / hbar)

# Precompute operators
T = hbar * k ** 2 / (2 * m)  # Kinetic energy in momentum space
exp_T = np.exp(-1j * T * dt / hbar)  # Kinetic step operator

# Define the harmonic potential
#V = 0.5 * m * (x ** 2)  # Harmonic oscillator potential
#V = 0

# Define a continuous approximation to the delta function potential
V0 = 75  # Depth of the potential well
sigma = 0.5  # Width of the delta function approximation

V = V0 * (1 / (np.sqrt(2 * np.pi) * sigma)) * np.exp(-x**2 / (2 * sigma**2))

exp_V = np.exp(-1j * V * dt / hbar) 

fig, ax = plt.subplots(figsize=(4, 3))  # Quadruple the size (4x width and height)
line, = ax.plot(x, np.abs(psi) ** 2, label="|Psi|^2", color="blue")
# Add vertical lines to mark periodic boundary conditions
ax.axvline(-x_max, color="black", linestyle="--", linewidth=1)
ax.axvline(x_max, color="black", linestyle="--", linewidth=1)

# Remove axes and legends
ax.axis("off")
ax.set_title("Time Evolution of a Quantum Wave Packet")
ax.fill_between(x, 0, V, color="red", alpha=0.3, label="Potential Well")  # Normalized potential well
ax.set_xlim(-x_max, x_max)
ax.set_ylim(0, 1)  # Set y-axis limits from 0 to 1
#ax.set_xlabel("x")
#ax.set_ylabel("|Psi(x)|^2")
#ax.set_title("Linear Schrödinger Equation with Delta-like Potential")
#ax.legend()

# Update function for animation
def update(frame):
    global psi
    psi = np.fft.ifft(exp_T * np.fft.fft(psi))  # Kinetic step in Fourier space
    psi = exp_V * psi
    psi /= np.sqrt(np.sum(np.abs(psi) ** 2) * dx)  # Normalize
    line.set_ydata(np.abs(psi) ** 2)
    return line,

# Create animation
ani = FuncAnimation(fig, update, frames=num_steps, blit=True, interval=20)
output_path = "./gif2.gif"
ani.save(output_path, writer="pillow", fps=30)

output_path
