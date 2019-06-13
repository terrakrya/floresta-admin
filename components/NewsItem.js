import React from 'react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import toReal from '../lib/toReal';

const styles = {
	card: {
		width: '100%',
		// height: 400,
		margin: 7
	},
	media: {
		// ⚠️ object-fit is not supported by IE 11.
		objectFit: 'cover'
	}
};

const NewsItem = ({ classes, id, description, link }) => {
	return (
		<Card className={classes.card}>
			<CardActionArea>
				<CardContent>
					<Typography gutterBottom variant="h5" component="h2">
						<a href={link} target="_blank">
							{link}
						</a>
					</Typography>
					<Typography component="p">
						<span dangerouslySetInnerHTML={{ __html: description }} />
					</Typography>
				</CardContent>
			</CardActionArea>
			<CardActions>
				<Button size="small" color="primary" onClick={() => Router.push(`/news_edit?id=${id}`)}>
					Editar
				</Button>
			</CardActions>
			<style jsx>{``}</style>
		</Card>
	);
};

NewsItem.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NewsItem);