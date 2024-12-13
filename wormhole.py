import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

# Define constants
r0 = 1.0  # throat radius, for example
T_values = [0.5, 1.0, 1.5, 2.0]  # different T values to iterate through

# Create a figure and 3D axis
fig = plt.figure(figsize=(8, 6))
ax = fig.add_subplot(111, projection='3d')

# Set up a grid in polar coordinates
r = np.linspace(0, 2.0, 200)    # radial coordinate
theta = np.linspace(0, 2*np.pi, 200)
r, theta = np.meshgrid(r, theta)

# Convert to Cartesian coordinates for plotting
x = r * np.cos(theta)
y = r * np.sin(theta)

# Choose a T value to visualize
T = 0.5  # You can vary this parameter

# Define the wormhole shape
# Example shape function (toy model): z^2 = r0^2 + T^2 - r^2
# Only define real z where (r0^2 + T^2 - r^2) >= 0
z_squared = r0**2 + T**2 - r**2
z_mask = z_squared >= 0

z_pos = np.sqrt(np.where(z_mask, z_squared, np.nan))
z_neg = -z_pos

# Plot the upper part of the wormhole surface
ax.plot_surface(x, y, z_pos, rstride=2, cstride=2, cmap='viridis', edgecolor='none', alpha=0.8)
# Plot the lower part of the wormhole surface
ax.plot_surface(x, y, z_neg, rstride=2, cstride=2, cmap='viridis', edgecolor='none', alpha=0.8)

# Customize the visualization
ax.set_xlabel('X')
ax.set_ylabel('Y')
ax.set_zlabel('Z')
ax.set_title(f"Wormhole Geometry for T={T}")
ax.set_xlim(-2, 2)
ax.set_ylim(-2, 2)
ax.set_zlim(-2, 2)

plt.tight_layout()
plt.show()

# If you want to depict the dynamics, you could loop over T_values and save frames:
# for T in T_values:
#     fig = plt.figure(figsize=(8, 6))
#     ax = fig.add_subplot(111, projection='3d')
#     
#     z_squared = r0**2 + T**2 - r**2
#     z_mask = z_squared >= 0
#     z_pos = np.sqrt(np.where(z_mask, z_squared, np.nan))
#     z_neg = -z_pos
#     
#     ax.plot_surface(x, y, z_pos, rstride=2, cstride=2, cmap='viridis', edgecolor='none', alpha=0.8)
#     ax.plot_surface(x, y, z_neg, rstride=2, cstride=2, cmap='viridis', edgecolor='none', alpha=0.8)
#     
#     ax.set_xlabel('X')
#     ax.set_ylabel('Y')
#     ax.set_zlabel('Z')
#     ax.set_title(f"Wormhole Geometry for T={T}")
#     ax.set_xlim(-2, 2)
#     ax.set_ylim(-2, 2)
#     ax.set_zlim(-2, 2)
#     
#     plt.tight_layout()
#     plt.savefig(f"wormhole_T_{T}.png")
#     plt.close(fig)
