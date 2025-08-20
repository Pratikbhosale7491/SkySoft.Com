FROM nginx:alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom config
COPY nginx/default.conf /etc/nginx/conf.d/

# Copy website files
COPY . /usr/share/nginx/html

EXPOSE 80
